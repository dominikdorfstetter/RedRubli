import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackbarService } from '../../snackbar.service';
import { UserService, Credentials } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';
import { FirebaseErrorService } from '../../services/firebase.error.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  
  constructor(public afAuth: AngularFireAuth, 
              private snackbarService: SnackbarService, 
              private userService: UserService,
              private fes: FirebaseErrorService) { }

  signOut(): void {
    this.userService.logOut();
  }

  getUser(): Observable<User> {
    return this.userService.getUser();
  }

  submit() {
    if (this.form.valid) {
      const credentials = {
        username: this.form.value['username'],
        password: this.form.value['password']
      } as Credentials;

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
