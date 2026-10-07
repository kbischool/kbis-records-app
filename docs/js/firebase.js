/* KBIS Records: Firebase login + private database access.
   Loaded as a module. Exposes window.KBIS_FB and window.KBIS_FB_READY. */
const V = '10.14.1';
const BASE = `https://www.gstatic.com/firebasejs/${V}/`;
const FB = (window.KBIS_FB = { error: null, user: null, isAdmin: false });
let auth, db, A, F;
const watchers = [];

async function start() {
  const cfg = window.KBIS_FIREBASE;
  if (!cfg || !cfg.apiKey) { FB.error = 'Login is not set up yet. Ask the administrator to finish the Firebase setup.'; return; }
  try {
    const app = await import(BASE + 'firebase-app.js');
    A = await import(BASE + 'firebase-auth.js');
    F = await import(BASE + 'firebase-firestore.js');
    const a = app.initializeApp(cfg);
    auth = A.getAuth(a); db = F.getFirestore(a);
  } catch (e) { FB.error = 'You appear to be offline. Connect to the internet to sign in.'; return; }

  A.onAuthStateChanged(auth, async (user) => {
    if (!user) { FB.user = null; FB.isAdmin = false; watchers.forEach((w) => w(null)); return; }
    try {
      const snap = await F.getDoc(F.doc(db, 'staff', user.email.toLowerCase()));
      if (!snap.exists()) throw new Error('no-staff');
      FB.user = user; FB.isAdmin = snap.data().role === 'admin';
      watchers.forEach((w) => w(user));
    } catch (e) {
      await A.signOut(auth);
      watchers.forEach((w) => w(null, 'This account has not been given access. Please contact the administrator.'));
    }
  });
}

FB.watch = (cb) => { watchers.push(cb); if (FB.user) cb(FB.user); else if (auth && auth.currentUser === null) cb(null); };
FB.signIn = (email, pass) => A.signInWithEmailAndPassword(auth, email.trim(), pass);
FB.signOut = () => A.signOut(auth);
FB.reset = (email) => A.sendPasswordResetEmail(auth, email.trim());
FB.friendly = (e) => {
  const c = (e && e.code) || '';
  if (/wrong-password|invalid-credential|user-not-found|invalid-email/.test(c)) return 'Email or password is incorrect.';
  if (/too-many-requests/.test(c)) return 'Too many attempts. Wait a few minutes and try again.';
  if (/network/.test(c)) return 'No internet connection. Please try again.';
  if (/unauthorized-domain/.test(c)) return 'This website address is not authorised in Firebase (auth/unauthorized-domain).';
  return 'Could not sign in. Please try again.';
};

FB.fetchAll = async () => {
  const one = async (name) => {
    const s = await F.getDoc(F.doc(db, name, 'main'));
    if (!s.exists()) throw new Error('no-data');
    return JSON.parse(s.data().json);
  };
  const [meta, invoice, stock, snap] = await Promise.all([
    one('meta'), one('invoice'), one('stock').catch(() => ({ uniforms: [], textbooks: [], notebooksAndStationery: [], stock: [] })),
    F.getDocs(F.collection(db, 'students')),
  ]);
  const students = snap.docs.map((d) => JSON.parse(d.data().json))
    .sort((x, y) => (x.lastName + x.firstName).localeCompare(y.lastName + y.firstName));
  return { students, invoice, meta, stock };
};

/* Admin only: replace all records with a freshly built set. */
FB.publish = async ({ students, invoice, meta, stock }, onProgress = () => {}) => {
  const keep = new Set(students.map((s) => s.id));
  const old = await F.getDocs(F.collection(db, 'students'));
  const ops = [];
  old.docs.forEach((d) => { if (!keep.has(d.id)) ops.push((b) => b.delete(d.ref)); });
  students.forEach((s) => ops.push((b) => b.set(F.doc(db, 'students', s.id), { json: JSON.stringify(s) })));
  [['meta', meta], ['invoice', invoice], ['stock', stock]].forEach(([n, v]) =>
    ops.push((b) => b.set(F.doc(db, n, 'main'), { json: JSON.stringify(v) })));
  for (let i = 0; i < ops.length; i += 400) {
    const batch = F.writeBatch(db);
    ops.slice(i, i + 400).forEach((op) => op(batch));
    await batch.commit();
    onProgress(Math.min(i + 400, ops.length), ops.length);
  }
};

window.KBIS_FB_READY = start();
