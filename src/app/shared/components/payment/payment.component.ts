import { Component, OnInit, Input } from '@angular/core';
import { StripeToken, StripeSource } from 'stripe-angular';
import { UserAccount } from '../../services/user.service';

export const STRIPE_TEMPLATE = `
<div *ngIf="invalidError" style="color:red">
  {{ invalidError.message }}
</div>

<stripe-card
  #stripeCard
  (catch) = "onStripeError($event)"
  [(invalid)] = "invalidError"
  (tokenChange) = "setStripeToken($event)"
  (sourceChange) = "setStripeSource($event)"></stripe-card>
<!-- stripe source not intended to stand alone like this -->
<stripe-source #stripeSource
  (catch)     = "$event"
  [(source)]  = "source"
  [(invalid)] = "invalidError"></stripe-source>
<button type="button" (click)="stripeCard.createToken(customerMeta)">createToken</button>
<br>
<button type="button" (click)="stripeSource.createSource(stripeCard)">createSource</button>
`;

export interface StripeCustomerMeta {
  name: string;
  address_city: string;
  address_line1: string;
  address_line2?: string;
  address_country: string;
  address_zip: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: STRIPE_TEMPLATE,
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input('customer_meta') user: UserAccount;

  customerMeta: StripeCustomerMeta;

  constructor() { }

  onStripeInvalid(error: Error) {
    console.log('Validation Error', error);
  }
 
  setStripeToken(token: StripeToken) {
    console.log('Stripe token', token);
  }
 
  setStripeSource(source: StripeSource) {
    console.log('Stripe source', source);
  }
 
  onStripeError(error: Error){
    console.error('Stripe error', error);
  }

  ngOnInit() {
    this.customerMeta = {
      name: this.user.displayName,
      address_city: this.user.city,
      address_line1: this.user.street,
      address_country: this.user.countryCode,
      address_zip: this.user.zipcode
    } as StripeCustomerMeta;
  }

}
