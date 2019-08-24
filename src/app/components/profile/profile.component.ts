import { Component, OnInit } from '@angular/core';
import { UserService, UserAccount } from 'src/app/shared/services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/* stripe */
import { StripeScriptTag } from 'stripe-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public userAccount$: Observable<UserAccount>;
  private publishableKey: string = "pk_test_JxqHG4Z2SdoRBpqp9mGDPnP2";


  constructor(private userS: UserService, 
              public StripeScriptTag: StripeScriptTag) {
    this.userAccount$ = this.getUserAccount();
    this.StripeScriptTag.setPublishableKey(this.publishableKey);
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
