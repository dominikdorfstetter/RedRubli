import { Injectable } from '@angular/core';
import { StripeToken, StripeSource } from 'stripe-angular';

export const STRIPE_TEMPLATE = `
<div *ngIf="invalidError" style="color:red">
  {{ invalidError.message }}
</div>
 
<stripe-card
  #stripeCard
  (catch) = "onStripeError($event)"
  [(invalid)] = "invalidError"
  (tokenChange) = "setStripeToken($event)"
  (sourceChange) = "setStripeSource($event)"
></stripe-card>
 
<button type="button" (click)="stripeCard.createToken(extraData)">createToken</button>
`;

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor() { }

}
