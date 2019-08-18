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
  takeUntil,
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
  flags?: {
    registrationCompleted?: boolean,
    acceptedTerms?: boolean,
    acceptedTermsTS?: Date,
    hasAffiliates?: boolean,
  };
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
   * login with email and password
   * @param {username, password} LoginCredentials username/email and password
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
   * Perform login with email instead of username
   * @param {username, password} LoginCredentials
   */
  async logInWithUsernameAndPassword({username, password}: LoginCredentials) {
    this.clearUserObj();
    const email: string = await this.getEmailByUsername(username);
    if(!!email) {
      const ret = this.logInWithEmailAndPassword({username: email, password}).catch(
        err => {
          return Promise.reject(err);
        }
      );
      return ret;
    } else {
      return Promise.reject('auth/noEmailFound');
    }
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
            flags: {
              registrationCompleted: true,
              acceptedTerms: true,
              acceptedTermsTS: new Date()
            },
            city: profileData.city,
            street: profileData.street,
            phone: profileData.phone,
            username: profileData.username
          };
          
          // write user profile data
          return userRef.set(data).then(() => {
            // send email-verification
            this.sendEmailVerificationLink().then(() => {
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
      return Promise.reject(error);
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
  public async sendEmailVerificationLink() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
  }
  
  /**
   * Send password reset email
   * @param passwordResetEmail the email we send the password reset mail to
   */
  public async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
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
            return this.firestoreP.doc$<UserAccount>(`${userUrl}/${user.uid}`);
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
   * @param search the value to search for
   * @param field what field are we going to search for?
   */
  private getUserBy$(search: string, field: string): Observable<UserAccount[]> {
    let usersRef$: Observable<UserAccount[]> = this.firestoreP.col$<UserAccount>(`users`, 
                    ref => ref.where(field, '==', search));
  
    return usersRef$.pipe(first());
  } //WORKS
  
  /**
   * Does the username already exist?
   * @param username the username to check
   * @returns true if username already exists or false if it doesn't
   */
  public async userNameExists(username: string): Promise<boolean> {
    const ret = await this.getUserBy$(username, 'username').toPromise();
  
    // if username exists return true; else false
    return Promise.resolve(!!ret[0] ? true : false);
  }
  
  /**
   * Get an emailadress from a username
   * @param username the username to get the email-address
   * @returns emailadress that belongs to username or null
   */
  public async getEmailByUsername(username: string): Promise<string> {
    const ret = await this.getUserBy$(username, 'username').toPromise();
  
    // if username exists return true; else false
    return Promise.resolve(!!ret[0] ? ret[0].email : null);
  }
}
