/* Admin-only spreadsheet upload. Runs the school's build_data.py inside the browser (Pyodide),
   then saves the result to the private database. Nothing is sent to GitHub. */
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const $ = (id) => document.getElementById(id);
const log = (t) => { $('log').textContent += t + '\n'; };

await window.KBIS_FB_READY;
const fb = window.KBIS_FB;
fb.watch((user) => {
  if (!user) { $('who').textContent = fb.error || 'Please sign in first on the records page.'; return; }
  if (!fb.isAdmin) { $('who').textContent = 'Only administrators can upload spreadsheets.'; return; }
  $('who').textContent = `Signed in as ${user.email}.`;
  $('files').disabled = false; $('go').disabled = false;
});

async function loadPyodideOnce() {
  if (!window.loadPyodide) {
    await new Promise((ok, no) => { const s = document.createElement('script'); s.src = PYODIDE + 'pyodide.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  return window.loadPyodide({ indexURL: PYODIDE });
}

$('go').addEventListener('click', async () => {
  const files = [...$('files').files];
  if (!files.length) { log('Choose your Excel files first.'); return; }
  $('go').disabled = true; $('log').textContent = '';
  try {
    log('Preparing the spreadsheet reader (first time takes about a minute)…');
    const py = await loadPyodideOnce();
    await py.loadPackage(['pandas', 'openpyxl']);
    py.setStdout({ batched: (t) => log(t) });
    py.FS.mkdirTree('/app/source'); py.FS.mkdirTree('/app/docs/data');
    for (const f of files) py.FS.writeFile('/app/source/' + f.name, new Uint8Array(await f.arrayBuffer()));
    log(`Reading ${files.length} file(s)…`);
    const code = await (await fetch('upload/build_data.py', { cache: 'no-cache' })).text();
    py.globals.set('__file__', '/app/build_data.py');
    await py.runPythonAsync(code);
    const read = (n) => JSON.parse(py.FS.readFile(`/app/docs/data/${n}.json`, { encoding: 'utf8' }));
    const data = { students: read('students'), invoice: read('invoice'), meta: read('meta') };
    let stock; try { stock = read('stock'); } catch (e) { stock = { uniforms: [], textbooks: [], notebooksAndStationery: [], stock: [] }; }
    log(`Saving ${data.students.length} students…`);
    await fb.publish({ ...data, stock }, (d, t) => log(`Saved ${d} of ${t}`));
    log('Done. Open the records page and tap Refresh view if asked.');
  } catch (e) {
    log('Something went wrong: ' + (e && e.message ? e.message : e) + '\nNothing was changed if you see this before "Saving". Check the file names and try again.');
  } finally { $('go').disabled = false; }
});
