import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackbarService } from '../../snackbar.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from 'firebase';

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
  
  constructor(public afAuth: AngularFireAuth, private snackbarService: SnackbarService, private userService: UserService) { }

  signOut(): void {
    this.userService.logOut();
  }

  getUser(): Observable<User> {
    return this.userService.getUser();
  }

  submit() {
    if (this.form.valid) {
      this.afAuth.auth.signInWithEmailAndPassword(this.form.value['username'], this.form.value['password'])
        .then(data => {
          this.snackbarService.showSnackBar('You are now authenticated.', 'OK');
        });
    } 
  }

  googleSignIn() {
    this.userService.googleSignin();
  }

}
