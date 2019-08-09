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
  of,
  Subscription
} from 'rxjs';
import {
  filter,
  switchMap,
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
import { CountryService } from './country.service';

const userUrl: String = 'users';

/*  interface: login credentials
  =============================*/
export interface LoginCredentials {
  username: string;
  password: string;
}

export enum GENDER {
  MALE='m',
  FEMALE='f',
  DIVERSE='d'
}

/*  interface: user profile data
  =============================*/
export interface ProfileData {
  title: string;
  firstname: string;
  lastname: string;
  birthday: string;
  gender: GENDER;
}

export interface RegisterData {
  profile: ProfileData;
  email: string;
  password: string;
  contact: ContactData;
}

export interface ContactData {
  country: string;
  zipcode: number;
  city: string;
  street: string;
}

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  private user$: ReplaySubject<User> ;
  private userSub: Subscription;

  constructor(private afAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    private afStore: AngularFirestore) {}

  ngOnInit(): void {
  }

  /*  get user obj from firestore
    =============================*/
  getUser(): Observable<User> {
    if (!this.user$) {
      this.user$ = new ReplaySubject(1);
      this.userSub = this.afAuth.authState.pipe(
        // we fetch the real saved user profile from firestore
        switchMap((user: User) => {
          // user is logged in
          if (user) {
            return this.afStore.doc<User>(`${userUrl}/${user.uid}`).valueChanges();
          } else {
            // user is logged out
            return of(null);
          }
        }),
      ).subscribe(
        (user: User) => {
          if(!!user) this.user$.next(user);
        },
        err => this.user$.next(err),
      );
    }
    return this.user$.asObservable().pipe(filter(user => !!user));
  }

  /*  end your current session
    ==========================*/
  logOut(): void {
    this.afAuth.auth.signOut().then(_ => {
      this.snackbarService.showSnackBar('Hope we will see you soon!', 'Goodbye!');
      this.clearUserObj();
    });
  }

  /*  login with email and password
    ==============================*/
  async logInWithEmailAndPassword({username, password}: LoginCredentials) {
    this.clearUserObj();
    return await this.afAuth.auth.signInWithEmailAndPassword(username, password)
      .then(() => {
        return Promise.resolve();
      }).catch(err => {
        return Promise.reject(err);
      });
  }

  /*  clear current userObj
    ========================*/
  private clearUserObj(): void {
    if (this.user$) this.user$.complete();
    this.userSub.unsubscribe();
    this.user$ = undefined;
  }

  /*  set user data on firebase user obj
    ====================================*/
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(`${userUrl}/${user.uid}`);

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

  /*  set user data on firebase user obj
    ====================================*/
  private updateUserProfile(profileData: ProfileData) {
    // Sets user data to firestore on login
/*     const userRef: AngularFirestoreDocument<User> = this.afStore.doc(`${userUrl}/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    } as User;

    return userRef.set(data, {
      merge: true
    }) */
  }

  /*  Google Sign in
    ================*/
  async googleSignin() {
    this.clearUserObj();
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return !!credential ? Promise.resolve(this.updateUserData(credential.user)) : Promise.reject();
  }

  /*  Send email verification link
    ==============================*/
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  // Send password reset email
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }
}
