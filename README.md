# KBIS Records

Staff-only student records and fee accounts for KBIS Schools. It works on phones and computers and can be installed to the home screen.

[Live site](https://kbischool.github.io/kbis-records-app/) · [Report an issue](../../issues)

## About
KBIS Records lets school staff look up any student, see the sessions and terms they were enrolled for, and open an itemised fee account. It also shows fee structures and stock. Access is limited to approved staff accounts, and no student data is stored in this repository.

## Features
- Sign in with a staff email and password
- Student search with filters by session, class and status
- Itemised fee account for each term, shareable as text
- Fee structure and stock views
- Works offline after sign-in and updates when back online
- Light and dark appearance that follows the device setting
- Administrators can update records by uploading the school's Excel workbooks

## Tech stack
Plain HTML, CSS and JavaScript · Firebase Authentication and Firestore · GitHub Actions and GitHub Pages · Pyodide (runs the spreadsheet reader in the browser)

## Project structure
```
docs/            the website (HTML, CSS, JavaScript, icons)
docs/upload/     spreadsheet reader used by the upload page
docs/guides/     setup, deployment and customising guides
firestore.rules  database access rules
.github/         automatic deploy, security scan and updates
```

## Contributing
Open an issue on GitHub to report a bug or suggest an idea. Do not include student information in issues.

## Credits
Fonts: Fraunces, Manrope and IBM Plex Mono (SIL Open Font License). Spreadsheet reading: Pyodide, pandas, openpyxl.
