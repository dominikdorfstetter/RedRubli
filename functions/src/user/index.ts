import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Side-Effects that happen when user creates an acount
 */
export const onUserCreate = functions.auth.user().onCreate((user, context) => {
  const flags = {
    spentMoney: false,
    hasAffiliates: false
  }

  const userobj = {
    "email": user.email !== undefined ? `${user.email}` : 'invalid',
    "createdAt": context.timestamp,
    "roles": {
      "customer": true
    },
    flags
  }

  const userRef = db.doc(`users/${user.uid}`);

  return userRef.set(userobj, {
    merge: true
  });
});

/**
 * Side-Effects on updating the user-profile
 */
export const updateUser = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    // Get an object representing the current document
    const newValue = !!change.after.data() ? change.after.data() : {};

    return admin.firestore().doc(`usernameHasMail/${change.after.id}`).set({
      username: !!newValue!['username'] ? newValue!['username'] : '',
      email: !!newValue!['email'] ? newValue!['email'] : ''
    }).catch(error => {
      console.error('could not update usernameHasMail - ', error);
    }).then(() => {
      console.log('updated username/mail on usernameHasMail/', change.after.id);
    });
  });

/**
 * Side-Effects that happen when user deletes his acount
 */
export const onUserDelete = functions.auth.user().onDelete(user => {
  const userRef = db.doc(`users/${user.uid}`);
  return userRef.delete();
});
