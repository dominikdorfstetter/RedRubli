import { Injectable } from '@angular/core';

const MIN_LEN_PASSWORD: number = 6;
const MAX_LEN_PASSWORD: number = 15;
const PASSWORD_API = 'https://passwordutility.net/api/password/validate?password=';
const GENERATE_PW_API = 
  'https://passwordutility.net/api/password/generate?length={length}&uppercase={uppercase}&digits={digits}&specialcharacters={spchar}';
// https://cmatskas.com/password-validation-and-creation-using-a-public-api/
// TODO: create password API connection

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

  /**
   * check if email is valid
   * @param email the email to check
   */
  public checkEmail = (email: string): boolean => {
    const mailRegex = 
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return !!email && mailRegex.test(email);
  };

  /**
   * Test if a password matches our requirements
   * @param password the password to check
   */
  public checkPassword(password: string): boolean {
    const pass_trim = password.trimLeft().trimRight();
    return !!password && pass_trim.length >= MIN_LEN_PASSWORD 
              && pass_trim.length <= MAX_LEN_PASSWORD;
  }

  /**
   * check string, takes target and len_min, len_max
   * @param target the string to check
   * @param len_min minimum length
   * @param len_max maximum length
   * @returns true or false
   */
  public checkString(target: string, len_min: number, len_max: number): boolean {
    const targetTrim = target.trim();
    return !!target && !!targetTrim && targetTrim.length >= len_min 
            && targetTrim.length <= len_max; 
  }

  /**
   * check a zipcode for validity
   * @param zipCode a zipcode to check
   * @param length how long is the zipCode?
   */
  public checkZipCode(zipCode: string, length: number): boolean {
    let expression_str = '^\\d{[length]}$';
    expression_str = expression_str.replace('[length]', '' + length);

    const expression = new RegExp(expression_str);

    return !!zipCode && expression.test(zipCode);
  }

  /**
   * test phone number
   * @param phoneNumber the phoneNumber to test
   */
  public checkPhoneNumber(phoneNumber: string): boolean {
    const expression = /^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d)+$/;

    return !!phoneNumber && expression.test(phoneNumber);
  }
}
