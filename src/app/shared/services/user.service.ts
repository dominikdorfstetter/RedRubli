import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  ReplaySubject,
  BehaviorSubject,
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
  map,
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
import { FirestoreProvider } from './firestore.provider';
import { Serializable } from './serializable';

const userUrl: String = 'users';
const tokenName = 'auth_token';

/*  interface: login credentials
  =============================*/
export interface LoginCredentials {
  username: string;
  password: string;
}

class UserAuth extends Serializable {
  username: string;
  email: string;
}

/*  Roles
  =======*/
export interface Roles {
  admin?: boolean;
  editor?: boolean;
  customer?: boolean;
  sales?: boolean;
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
  roles: Roles;
  flags?: {
    registrationCompleted?: boolean,
    acceptedTerms?: boolean,
    acceptedTermsTS?: Date,
    hasAffiliates?: boolean,
    spentMoney?: boolean,
  };
  username: string;
}

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userAccount$: ReplaySubject<UserAccount> ;
  private user = { username: undefined, email: undefined };
  private userSub: Subscription;
  private isLogged$ = new BehaviorSubject(false);

  constructor(private afAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    private afStore: AngularFirestore,
    private loggerS: LoggerService,
    private snackbarS: SnackbarService,
    private firestoreP: FirestoreProvider) {}

  /**
   * Checks if the user is allowed to perform an action
   * @param allowedRoles (An array with allowed roles for a specific task)
   * @param user (The useraccount to check)
   */
  public checkAuthorization(user: UserAccount, allowedRoles: string[]): boolean {
    if(!!user) {
      // loop over allowed roles array and return true if a role is found
      allowedRoles.map(role => {
        if(user.roles[role]) {
          return true;
        }
      });
      return false;
    } else {
      return false;
    }
  }

  /**
   * Checks if user has read permissions
   */
  public canRead(user: UserAccount) {
    const allowed = ['admin', 'sales', 'customer', 'editor'];
    return this.checkAuthorization(user, allowed);
  }

  /**
   * Checks if user has edit permissions
   */
  public canEdit(user: UserAccount) {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }

  /**
   * checks if user can create a payment plan
   */
  public canCreatePaymentPlans(user: UserAccount) {
    const allowed = ['admin', 'sales'];
    return this.checkAuthorization(user, allowed);
  }

  /**
   * checks if user has godlike powers
   */
  public canSudo(user: UserAccount) {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  /**
   * is user logged in?
   */
  public get loggedIn(): boolean {
    return this.isLogged$.value;
  }

  /**
   * get firebase auth token
   */
  public get authToken(): auth.UserCredential {
    return JSON.parse(localStorage.getItem(tokenName));
  }

  /**
   * send current user or load data from backend using token
   */
  public get userData(): Observable<any> {
    return this.loadUser();
  }

  /**
   * Load basic user information
   */
  private loadUser(): Observable<any> {
    if (localStorage.getItem('uid') && localStorage.getItem('email')) {
      this.user = {
        username: localStorage.getItem('uid'),
        email: localStorage.getItem('email'),
      };
    }
    return of(this.user);
  }

  /**
   * login with email and password
   * @param {username, password} LoginCredentials username/email and password
   */
  async logInWithEmailAndPassword({username, password}: LoginCredentials) {
    // this.clearUserObj();
    return await this.afAuth.auth.signInWithEmailAndPassword(username, password)
      .then(async (credentials: auth.UserCredential) => {
          const jwt_token = await credentials.user.getIdToken();

          localStorage.setItem(tokenName, jwt_token);
          
          // only for example
          localStorage.setItem('uid', credentials.user.uid);
          localStorage.setItem('email', credentials.user.email);
          localStorage.setItem('displayName', credentials.user.displayName);
          this.isLogged$.next(true);
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
    // this.clearUserObj();
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
      this.isLogged$.next(false);
      this.clearUserObj();
    });
  }
  
  /**
   * clear current userObj
   */
  private clearUserObj(): void {
    if (this.userAccount$) this.userAccount$.complete();
    this.userSub.unsubscribe();
    this.userAccount$ = undefined;
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
          // Sets user data to firestore on login
          const userRef: AngularFirestoreDocument<UserAccount> = this.afStore.doc(`${userUrl}/${user.uid}`);
          
          const data: UserAccount = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: `${profileData.firstname} ${profileData.lastname}`,
            gender: profileData.gender,
            birthday: profileData.birthday.toDate(),
            zipcode: profileData.zipcode,
            countryCode: profileData.country,
            roles: {
              customer: true
            },
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
    // this.clearUserObj();
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
    if (!this.userAccount$) {
      this.userAccount$ = new ReplaySubject(1);
      this.userSub = this.afAuth.authState.pipe(
        // we fetch the real saved user profile from firestore
        switchMap((user: User) => {
          // user is logged in
          if (!!user) {
            return this.firestoreP.doc$<UserAccount>(`${userUrl}/${user.uid}`);
          } else {
            // user is logged out
            return of(undefined);
          }
        }),
      ).subscribe(
        (user: UserAccount) => {
          if(!!user) {
            this.userAccount$.next(user);
            this.loggerS.logInfo('Successfully performed login.');
          } else {
            this.userAccount$.next(null);
          }
        },
        err => this.userAccount$.next(err),
      );
    }
    return this.userAccount$.asObservable();
  }
  
  /**
   * Returns observable of UserAuth
   * @param search the value to search for
   * @param field what field are we going to search for?
   */
  private getAuthBy$(search: string, field: string): Observable<UserAuth[]> {
    let usersRef$: Observable<UserAuth[]> = this.firestoreP.col$<UserAuth>(`usernameHasMail`, 
                    ref => ref.where(field, '==', search));
  
    return usersRef$.pipe(first(), map(data => {
      return data.map(element => {
        return new UserAuth(element);
      });
    }));
  } //WORKS
  
  /**
   * Does the username already exist?
   * @param username the username to check
   * @returns true if username already exists or false if it doesn't
   */
  public async userNameExists(username: string): Promise<boolean> {
    const ret = await this.getAuthBy$(username, 'username').toPromise();
  
    // if username exists return true; else false
    return Promise.resolve(!!ret[0] ? true : false);
  }
  
  /**
   * Get an emailadress from a username
   * @param username the username to get the email-address
   * @returns emailadress that belongs to username or null
   */
  public async getEmailByUsername(username: string): Promise<string> {
    const ret = await this.getAuthBy$(username, 'username').toPromise();
  
    // if username exists return true; else false
    return Promise.resolve(!!ret[0] ? ret[0].email : null);
  }
}
