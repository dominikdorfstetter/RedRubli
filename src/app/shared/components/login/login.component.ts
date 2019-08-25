import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  FormControl
} from '@angular/forms';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  SnackbarService
} from '../../services/snackbar.service';
import {
  UserService,
  UserAccount
} from '../../services/user.service';
import {
  Observable
} from 'rxjs';
import {
  FirebaseErrorService
} from '../../services/firebase.error.service';
import {
  CountryService,
  LSC,
  CountrySelect
} from '../../services/country.service';
import { CheckService } from '../../services/check.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  public input = {
    username: '',
    password: '',
  }

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(public afAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private fes: FirebaseErrorService,
    private checkS: CheckService) {
  }

  getUser(): Observable < UserAccount > {
    return this.userService.getUser();
  }

  submit() {
    if (this.form.valid) {
      const credentials = {
        username: this.form.value['username'],
        password: this.form.value['password']
      };

      this.resetFields();

      if(this.checkS.checkEmail(credentials.username)) {
        this.userService.logInWithEmailAndPassword(credentials).then(() => {
          this.snackbarService.showSnackBar('Welcome.', 'OK');
        }).catch(err => {
          console.error(err);
          this.snackbarService.showSnackBar(this.fes.getTranslation(err.code), 'OK');
        });
      } else {
        this.userService.logInWithUsernameAndPassword((credentials)).then(() => {
          this.snackbarService.showSnackBar('Welcome.', 'OK');
        }).catch(err => {
          console.error(err);
          this.snackbarService.showSnackBar(this.fes.getTranslation(err.code), 'OK');
        });
      }
    }
  }

  googleSignIn() {
    this.userService.googleSignin();
  }

  get isLoggedIn(): boolean {
    return this.userService.loggedIn;
  }

  private resetFields(): void {
    this.form.value['username'] = '';
    this.form.value['password'] = '';
  }
}
