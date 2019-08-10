import { Injectable } from '@angular/core';

const MIN_LEN_PASSWORD: number = 6;
const MAX_LEN_PASSWORD: number = 15;

/** 
 * left trim
 */
String.prototype.trimLeft = String.prototype.trimLeft || function () {
  return this.replace(/^\s+/,"");
};

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

    return mailRegex.test(email);
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

  /**
   * check a zipcode for validity
   * @param zipCode a zipcode to check
   * @param digits how many digits does the zipcode have
   */
  public checkZipCode(zipCode: string, digits: number): boolean {
    let expression_str = '^\\d{[length]}$';
    expression_str = expression_str.replace('[length]', '' + digits);

    const expression = new RegExp(expression_str);

    return expression.test(zipCode);
  }

  /*  test phone number
    ===================*/
  public checkPhoneNumber(phoneNumber: string): boolean {
    const expression = /^[0-9()-+]+$/;
    const phonenumber_trim = phoneNumber.trim();

    return !!phonenumber_trim && expression.test(phonenumber_trim);
  }
}
