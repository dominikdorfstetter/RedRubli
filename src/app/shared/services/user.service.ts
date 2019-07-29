import {
  Injectable,
  OnInit
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  ReplaySubject,
  Observable,
  of
} from 'rxjs';
import {
  first,
  filter,
  switchMap,
  tap,
  map
} from 'rxjs/operators';
import {
  User
} from 'firebase';
import {
  SnackbarService
} from '../snackbar.service';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { auth } from  'firebase/app';

const userUrl: String = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  private user$: ReplaySubject < User > ;

  constructor(private afAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    private afStore: AngularFirestore) {}

  ngOnInit(): void {}

  // get userdata from firestore
  getUser(): Observable < User > {
    if (!this.user$) {
      this.user$ = new ReplaySubject(1);
      this.afAuth.authState.pipe(
        // we fetch the real saved user profile from firestore
        switchMap((user: User) => {
          // user is logged in
          if (user) {
            return this.afStore.doc < User > (`${userUrl}/${user.uid}`).valueChanges();
          } else {
            // user is logged out
            return of(null);
          }
        }),
      ).subscribe(
        (user: User) => {
          this.user$.next(user);
        },
        err => this.user$.next(err),
      );
    }
    return this.user$.asObservable().pipe(filter(user => !!user));
  }

  // end session
  logOut(): void {
    this.afAuth.auth.signOut().then(_ => {
      this.snackbarService.showSnackBar('Hope we will see you soon!', 'Goodbye!');

      // killing replay subjects
      if (this.user$) this.user$.complete();
      this.user$ = undefined;
    });
  }

  // set user data
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument < User > = this.afStore.doc(`${userUrl}/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    } as User;

    return userRef.set(data, {
      merge: true
    })
  }

  // Google signIn
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  // Send Email-Verification
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  // Send password reset email
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }
}
