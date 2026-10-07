# Firebase login setup (for the school owner)

**What this is.** Firebase Authentication is Google's free "front door" service. People type an email and password, and Firebase confirms who they are. Firestore is Firebase's database, a private filing cabinet in Google's cloud. After this setup, student records live in that cabinet instead of on GitHub, and only staff you approve can open it.

You only need a web browser. No terminal.

## Part A: Open your Firebase project
1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click your project. **You should see** the project's home page.

## Part B: Register the web app and copy its settings
1. Click the **gear icon** (top left) > **Project settings**.
2. Scroll to **Your apps**. Click the **`</>`** (Web) icon.
3. Type the nickname `KBIS Records`. Leave "Firebase Hosting" unticked. Click **Register app**.
4. **You should see** a block of code with `apiKey`, `authDomain`, `projectId`, `appId`, `messagingSenderId`. Keep this page open. You'll copy values in Part G.

## Part C: Turn on Email/Password login
1. Left menu: **Build > Authentication > Get started**.
2. Open the **Sign-in method** tab. Click **Email/Password**, switch **Enable** on, click **Save**.
3. **You should see** "Email/Password" listed as **Enabled**. (Leave Google sign-in off.)

## Part D: Allow your website address
1. **Authentication > Settings > Authorized domains > Add domain**.
2. Type `kbischool.github.io` and click **Add**. Add your own domain too if you have one.
3. **You should see** it in the list.

## Part E: Create the database
1. **Build > Firestore Database > Create database**.
2. Choose **Production mode**, pick the region closest to you (for example `europe-west`), click **Enable**.
3. **You should see** an empty database.

## Part F: Paste the security rules
1. In Firestore, open the **Rules** tab.
2. Delete everything in the box, then paste the full contents of the file `firestore.rules` from this repository (open it on GitHub and click the **Copy** icon).
3. Click **Publish**. **You should see** "Rules published".

## Part G: Create staff accounts (there is no public sign-up, by design)
1. **Authentication > Users > Add user**. Enter the staff member's email and a temporary password. Repeat for each person. Include yourself.
2. Go to **Firestore Database > Data > Start collection**. Collection ID: `staff`. Click **Next**.
3. **Document ID**: the person's email in **all lowercase**. Add a field named `role` (type string) with value `admin` (you) or `viewer` (everyone else). Click **Save**. Repeat for each person (**Add document**).
4. **You should see** one document per person. Anyone not in this list gets no access, even if they have an account.

## Part H: Add the settings to GitHub as secrets
A *secret* is a private setting GitHub stores for you.
1. Open the repository on GitHub > **Settings > Secrets and variables > Actions > New repository secret**.
2. Add these five, one at a time (Name, then the matching value from Part B, without quote marks):

| Name | Value from Part B |
|---|---|
| `FIREBASE_API_KEY` | apiKey |
| `FIREBASE_AUTH_DOMAIN` | authDomain |
| `FIREBASE_PROJECT_ID` | projectId |
| `FIREBASE_APP_ID` | appId |
| `FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |

3. **You should see** five secrets listed (values are hidden).

## Part I: Deploy
1. Repository > **Actions** tab > **Deploy** > **Run workflow** > **Run workflow**.
2. Wait for a **green tick**. A red cross means open it and read the error; see below.

## How to test that login works
1. Open the site. You should see a login screen.
2. Log in with a staff email. You should reach the records.
3. Log in with an email that is **not** in the `staff` list (create a test user first). You should see "no access".
4. Open the site in a private window without logging in. You should see **no** student data.

## Common errors and fixes
| Message | Fix |
|---|---|
| `auth/unauthorized-domain` | Redo Part D. Check spelling. |
| `auth/invalid-api-key` | A secret in Part H is wrong or missing. Re-copy it. |
| `permission-denied` | The person's email is missing from `staff`, has capital letters, or Part F wasn't published. |
| `auth/wrong-password` / `invalid-credential` | Use **Forgot password**, or reset it in Authentication > Users. |
| Blank page after deploy | Actions tab: red cross? Open it and read the first red line. |

## Glossary
- **API key**: an identifier for your web app. Not a password. The rules protect the data.
- **Authorized domain**: a website address Firebase allows to use login.
- **Security rules**: instructions that decide who may read or write data.
- **Secret**: a private value stored in GitHub, never in the code.
- **Role**: `admin` can upload spreadsheets; `viewer` can only read.

## What NOT to share or commit
Never put passwords, spreadsheets, student lists, or any "service account" or "private key" file in the repository. Never email staff passwords. Change a staff password the same day someone leaves, and delete their `staff` document.
