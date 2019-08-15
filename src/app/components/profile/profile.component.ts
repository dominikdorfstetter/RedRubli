import { Component, OnInit } from '@angular/core';
import { UserService, UserAccount } from 'src/app/shared/services/user.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public userAccount$: Observable<UserAccount>;

  constructor(private userS: UserService, private snackbarS: SnackbarService) {
    this.userAccount$ = this.getUserAccount();
  }

  ngOnInit() {
  }

  private getUserAccount(): Observable<UserAccount> {
    return this.userS.getUser().pipe(tap(console.table));
  }

  signOut(): void {
    this.userS.logOut();
  }
}
