import { Component, OnInit } from '@angular/core';
import { CheckService } from '../../services/check.service';

// interface for user input
interface RegisterFormInput {
  gender: string;
  title: string;
  email: string;
  email_re: string;
  firstname: string;
  lastname: string;
  birthday: string;
  password: string;
  password_re: string;
  phone: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public acceptAGB: boolean;
  public birthday: Date;
  public formatEmail: boolean;
  public formatVorname: boolean;
  public formatNachname: boolean;
  public formatPassword: boolean;
  public formatBirthday: boolean;
  public formatPhone: boolean;
  public formatEmailRe: boolean;
  public formatGender: boolean;
  

  public input: RegisterFormInput = {
    phone: '' as string,
    password_re: '' as string,
    gender: '' as string,
    title: '' as string,
    email: '' as string,
    email_re: '' as string,
    password: '' as string,
    firstname: '' as string,
    lastname: '' as string,
    birthday: '' as string
  };

  constructor(private checkProvider: CheckService) { }

  ngOnInit() {
    // set form validation to true
    // so user seees a clean form
    this.setFormValidation(true);
    this.acceptAGB = false;
  }

  /**
   * sets form validation to a desired state
   * @param value boolean
   */
  setFormValidation(value: boolean) {
    this.formatEmail = value;
    this.formatNachname = value;
    this.formatVorname = value;
    this.formatPassword = value;
    this.formatBirthday = value;
    this.formatPhone = value;
    this.formatEmailRe = value;
    this.formatGender = value;
  }

  /**
   * validates all form data
   * @param userInput the input data from register form
   */
  validateRegister(userInput: RegisterFormInput) {
    userInput.email = this.trimInput(userInput.email, false);
    userInput.password = this.trimInput(userInput.password, true);
    userInput.firstname = this.trimInput(userInput.firstname, false);
    userInput.lastname = this.trimInput(userInput.lastname, false);
    userInput.phone = this.trimInput(userInput.phone, false);
    userInput.email_re = this.trimInput(userInput.email_re, false);

    this.setFormValidation(true);

    if (userInput.gender === '') {
      this.formatGender = false;
    }

    if (!this.checkProvider.checkEmail(userInput.email)) {
      this.formatEmail = false;
    }

    if (!this.checkProvider.checkEmail(userInput.email_re) || userInput.email !== userInput.email_re) {
      this.formatEmailRe = false;
    }

    if (!this.checkProvider.checkPassword(userInput.password)) {
      this.formatPassword = false;
    }

    if (!this.checkProvider.checkString(userInput.firstname, 3, 15)) {
      this.formatVorname = false;
    }

    if (!this.checkProvider.checkString(userInput.lastname, 3, 15)) {
      this.formatNachname = false;
    }

    if (!userInput.birthday) {
      this.formatBirthday = false;
    }

    if (!userInput.phone || !this.checkProvider.checkPhoneNumber(userInput.phone)) {
      this.formatPhone = false;
    }

    return (
      this.formatPassword &&
      this.formatEmail &&
      this.formatVorname &&
      this.formatNachname &&
      this.formatBirthday &&
      this.formatPhone &&
      this.formatEmailRe &&
      this.formatGender
    );
  }

  /**
   * Trims an input
   * @param value the value to trim
   * @param trimStartEnd if true replace trailing and leading whitespace; if false replace all
   */
  private trimInput(value: string, trimStartEnd: boolean): string {
    return trimStartEnd ? value.trim() : value.replace(/ /g, '');
  }

  /**
   * Performs register if input data is correct
   * @param input the form input
   */
  performRegister(input: RegisterFormInput) {
    if (this.validateRegister(input)) {

    } else {

    }
  }
}
