# Putting KBIS Records online (for the school owner)

You only need a web browser. Take your time. Each step says what you should see.

## Why a new repository?
Your current repository is public and its history still holds the old student files. Deleting files does not remove them from history. A **new repository** starts with a clean history, and the app itself is now protected by login, so it is safe for the new one to be public too. The old site stays live until you switch.

## Part 1: Create the new repository
1. Go to github.com and sign in. Click the **+** (top right) > **New repository**.
2. Owner: `kbischool`. Name: `kbis-records-app`. Choose **Public**. Tick **Add a README file**. Click **Create repository**.
3. You should see an almost empty repository page.

## Part 2: Upload the app files
1. On your computer, double-click `kbis-records-complete.zip` to unzip it. (Windows: right-click > Extract All.)
2. In the repository, click **Add file > Upload files**.
3. Open the unzipped folder, select **everything inside it** (including the hidden `.github` folder), and drag it onto the GitHub page. If your computer hides `.github`, turn on "Show hidden files" first.
4. Wait for the upload to finish. Scroll down, click **Commit changes**.
5. You should see folders `.github`, `docs`, and the files `firestore.rules`, `.gitignore`, `README.md`.

## Part 3: Set up Firebase
Open `docs/guides/FIREBASE_LOGIN_SETUP.md` in the repository and follow it from Part A to Part H. In Part D, the domain `kbischool.github.io` is already correct.

## Part 4: Switch on GitHub Pages
1. Repository > **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. Go to the **Actions** tab > **Deploy** > **Run workflow**. A **green tick** means success. A **red cross** means open it and read the first red line, then see the guide's error table.
4. Your site is at `https://kbischool.github.io/kbis-records-app/`.

## Part 5: Load your records
1. Open the site and sign in with your admin email.
2. Tap **Sync**, then **Upload spreadsheets**.
3. Select all your Excel files together and tap **Update records**. The first time takes about a minute to start. You should see "Saved ... of ...", then "Done".

## Part 6: Retire the old site
1. Tell staff the new address. They sign in with their email and use **Add to Home Screen** again.
2. When everyone has moved, open the **old** repository > **Settings > Danger Zone > Change visibility > Make private** (or **Delete this repository**).

## Updating records later
Open the site > Sync > Upload spreadsheets > choose the files > Update records. GitHub is not involved.

## Turn on secret scanning (recommended)
Repository > **Settings > Code security** > switch on **Secret scanning** and **Push protection**.

## Going back
The old site is untouched until you retire it. If something in the new site fails, keep using the old one while you fix it.

## Own web address (optional)
Settings > Pages > **Custom domain**, enter it, then add the DNS records GitHub shows at your domain provider. Add the domain in Firebase > Authentication > Settings > Authorized domains.
