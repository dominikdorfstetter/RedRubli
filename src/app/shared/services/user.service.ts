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
  Subscription,
  Subject
} from 'rxjs';
import {
  filter,
  switchMap,
  take,
  takeUntil,
  map,
  tap,
  flatMap,
  reduce,
  first,
} from 'rxjs/operators';
import {
  User
} from 'firebase';
import {
  SnackbarService
} from './snackbar.service';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { auth } from  'firebase/app';
import { LoggerService } from './logger.service';
import { RegisterFormInput } from '../components/register/register.component';
import { Serializable } from './serializable';
import { FirestoreProvider } from './firestore.provider';

const userUrl: String = 'users';

/*  interface: login credentials
  =============================*/
export interface LoginCredentials {
  username: string;
  password: string;
}

/*  interface: user profile data
  =============================*/
export interface UserAccount {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  title?: string;
  birthday: Date;
  gender: string;
  countryCode: string;
  zipcode: string;
  city: string;
  street: string; 
  phone: string;
  createdAT?: number;
  username: string;
}

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  private user$: ReplaySubject<UserAccount> ;
  private userSub: Subscription;

  constructor(private afAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    private afStore: AngularFirestore,
    private loggerS: LoggerService,
    private snackbarS: SnackbarService,
    private firestoreP: FirestoreProvider) {}

  ngOnInit(): void {
  }

  /**
   * get user obj from firestore
   */
  public getUser(): Observable<UserAccount> {
    if (!this.user$) {
      this.user$ = new ReplaySubject(1);
      this.userSub = this.afAuth.authState.pipe(
        // we fetch the real saved user profile from firestore
        switchMap((user: User) => {
          // user is logged in
          if (user) {
            return this.firestoreP.doc$(`${userUrl}/${user.uid}`);
          } else {
            // user is logged out
            return of(null);
          }
        }),
      ).subscribe(
        (user: UserAccount) => {
          if(!!user) {
            this.user$.next(user);
            this.loggerS.logInfo('Successfully performed login.');
          }
        },
        err => this.user$.next(err),
      );
    }
    return this.user$.asObservable().pipe(filter(user => !!user));
  }

  /**
   * Returns observable of user
   * @param username the username to check
   */
  private userNameExists$(username: string): Observable<any> {
    let usersRef$ = this.firestoreP.col$(`users`, 
                    ref => ref.where('username', '==', username));

    return usersRef$;
  } //WORKS

  /**
   * Does the username already exist?
   * @param username the username to check
   */
  public async userNameExists(username: string): Promise<boolean> {
    let ret = [];

    await this.userNameExists$(username).pipe(first()).toPromise().then(
      data => {
        ret = data;
      },
      error => console.error(error)
    );
    
    // if any data is emitted, username exists on a UserAccount
    return Promise.resolve(!!ret[0] ? true : false);
  }

  /**
   * end your current session
   */
  public logOut(): void {
    this.afAuth.auth.signOut().then(_ => {
      this.snackbarService.showSnackBar('Hope we will see you soon!', 'Goodbye!');
      this.clearUserObj();
    });
  }

  /**
   * login with email and password
   * @param {username, password} Credentials username/email and password
   */
  async logInWithEmailAndPassword({username, password}: LoginCredentials) {
    this.clearUserObj();
    return await this.afAuth.auth.signInWithEmailAndPassword(username, password)
      .then(() => {
        return Promise.resolve();
      }).catch(err => {
        return Promise.reject(err);
      });
  }

  /**
   * clear current userObj
   */
  private clearUserObj(): void {
    if (this.user$) this.user$.complete();
    this.userSub.unsubscribe();
    this.user$ = undefined;
  }

  /**
   * set user data on firebase user obj
   */
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

  /**
   * set user data on firebase user obj
   * @param profileData Profile data to set on user
   */
  public async createUserProfile( profileData: RegisterFormInput) {
    this.afAuth.auth.createUserWithEmailAndPassword(profileData.email, profileData.password).then(
      () => {
        const unsubriber$ = new Subject<boolean>();

        this.afAuth.authState.pipe(takeUntil(unsubriber$)).subscribe(user => {
          console.log(user);
          // Sets user data to firestore on login
          const userRef: AngularFirestoreDocument<UserAccount> = this.afStore.doc(`${userUrl}/${user.uid}`);

          console.log(`${userUrl}/${user.uid}`);

          const data: UserAccount = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: `${profileData.firstname} ${profileData.lastname}`,
            gender: profileData.gender,
            birthday: profileData.birthday.toDate(),
            zipcode: profileData.zipcode,
            countryCode: profileData.country,
            city: profileData.city,
            street: profileData.street,
            phone: profileData.phone,
            username: ''
          };

          // write user profile data
          return userRef.set(data).then(() => {
            // send email-verification
            this.sendEmailVerification().then(() => {
              unsubriber$.next(true);
            });
          });
        })
      }
    ).catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        this.snackbarS.showSnackBar('Your password is too weak!', 'Dismiss');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      return Promise.reject(error);
    }).finally(() => {
      console.log('profile created');
    });
  }

  /**
   * Google Sign in
   */
  public async googleSignin() {
    this.clearUserObj();
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return !!credential ? Promise.resolve(this.updateUserData(credential.user)) : Promise.reject();
  }

  /**
   * Send email verification link
   */
  public async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  /**
   * Send password reset email
   * @param passwordResetEmail the email we send the password reset mail to
   */
  public async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }
}
