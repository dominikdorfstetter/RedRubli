import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService, LoginCredentials } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { FirebaseErrorService } from '../../services/firebase.error.service';
import { CountryService, LSC } from '../../services/country.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();
  public countries: Observable<string[]>;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  
  constructor(public afAuth: AngularFireAuth, 
              private snackbarService: SnackbarService, 
              private userService: UserService,
              private fes: FirebaseErrorService,
              private countryService: CountryService) 
  { 
    this.countries = this.getCountries();
  }

  signOut(): void {
    this.userService.logOut();
  }

  getCountries(): Observable<string[]> {
    return this.countryService.getCountries(LSC.DE);
  }

  getUser(): Observable<User> {
    return this.userService.getUser();
  }

  submit() {
    if (this.form.valid) {
      const credentials = {
        username: this.form.value['username'],
        password: this.form.value['password']
      } as LoginCredentials;

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
