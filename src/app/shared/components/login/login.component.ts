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


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();
  public countries: Observable < CountrySelect[] > ;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(public afAuth: AngularFireAuth,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private fes: FirebaseErrorService,
    private countryService: CountryService) {
    this.countries = this.getCountries$();
  }

  /**
   * On Init
   */
  ngOnInit(): void {
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
  }

  getCountries$(): Observable < CountrySelect[] > {
    return this.countryService.getCountries(LSC.DE);
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

      this.userService.logInWithEmailAndPassword(credentials).then(() => {
        this.snackbarService.showSnackBar('Willkommen.', 'OK');
      }).catch(err => {
        this.snackbarService.showSnackBar(this.fes.getTranslation(err.code), 'OK');
      });
    }
  }

  googleSignIn() {
    this.userService.googleSignin();
  }

}
