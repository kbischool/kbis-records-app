# Staff email confirmation (owner guide)

## Why this exists
Anyone in the world can create a Firebase account using any email address, even one they do not own. Without a check, a stranger could create an account with a staff member's email and be treated as that staff member. The app and the database rules now require each person to confirm their email address first.

## What staff will notice
The first time each person signs in after this update, the app sends a confirmation link to their email and shows a message. They open the link, then sign in again. This happens once per person.

## Order of steps (important)
Follow these in order. If you publish the new rules too early, staff who have not confirmed their email will be locked out until they do.

1. Merge the pull request on GitHub and wait for the green tick in the **Actions** tab.
2. Ask every staff member to open the app, sign in, open the confirmation email, tap the link, and sign in again. Passwords stay the same.
3. When every staff member and administrator can sign in, publish the new rules:
   1. Open the Firebase Console and select your project.
   2. Click **Firestore Database**, then the **Rules** tab.
   3. Delete everything in the box and paste the full contents of `firestore.rules` from this repository.
   4. Click **Publish**. You should see a message that the rules were published.
4. Test: sign in as an administrator and as a normal staff member. Both must see the records.

## If someone is locked out after publishing
Open the **Rules** tab again and find the function called `signedIn`. Replace its body with this, then click **Publish**:

```
function signedIn() {
  return request.auth != null && request.auth.token.email != null;
}
```

That restores the old behaviour while the person confirms their email. Put the stricter version back afterwards.

## If the confirmation email does not arrive
- Check the spam or junk folder.
- Wait a few minutes. Firebase limits how often it sends these emails.
- A staff member who forgot their password can use **Forgot password** on the sign-in screen; opening the reset link also confirms their email.
