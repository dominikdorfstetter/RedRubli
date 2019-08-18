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
        flags
    }

    const userRef = db.doc(`users/${user.uid}`);

    return userRef.set(userobj, { merge: true });
});

/**
 * Side-Effects that happen when user deletes his acount
 */
export const onUserDelete = functions.auth.user().onDelete(user => {
        const userRef = db.doc(`users/${user.uid}`);
        return userRef.delete();
});
