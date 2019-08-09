import { Injectable } from '@angular/core';

const MIN_LEN_PASSWORD: number = 6;
const MAX_LEN_PASSWORD: number = 15;

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor() { }

  /*  check if email is valid
    =========================*/
  public checkEmail = (email: string): boolean => {
    const mailRegex = 
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return mailRegex.test(email.trim());
  };

  /*  uses set default values to check password
    ==========================================*/
  public checkPassword(password: string): boolean {
    const pass_trim = password.trimLeft().trimRight();
    return !!pass_trim && pass_trim.length >= MIN_LEN_PASSWORD 
              && pass_trim.length <= MAX_LEN_PASSWORD;
  }

  /*  check string, takes target and len_min, len_max
    =================================================*/
  public checkString(target: string, len_min: number, len_max: number): boolean {
    const targetTrim = target.trim();
    return !!targetTrim && targetTrim.length >= len_min 
            && targetTrim.length <= len_max; 
  }

  /*  test zipCode
    ==============*/
  public checkZipCode(zipCode: string): boolean {
    const expression = /^\d{4}/; // just test zipCode for Austria --> 4 digits
    const zipcode_trim = zipCode.trim();

    return !!zipcode_trim && expression.test(zipcode_trim);
  }

  /*  test phone number
    ===================*/
  public checkPhoneNumber(phoneNumber: string): boolean {
    const expression = /^[0-9()-+]+$/;
    const phonenumber_trim = phoneNumber.trim();

    return !!phonenumber_trim && expression.test(phonenumber_trim);
  }
}
