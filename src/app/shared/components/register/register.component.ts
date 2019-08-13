import { Component, OnInit } from '@angular/core';
import { CheckService } from '../../services/check.service';
import { Observable } from 'rxjs';
import { CountryService, LSC, CountrySelect } from '../../services/country.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'

// interface for user input
interface RegisterFormInput {
  gender: string;
  title: string;
  email: string; 
  email_re: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  password: string;
  password_re: string;
  phone: string;
  country: CountrySelect;
  zipcode: string;
  street: string;
  city: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'de-AT'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class RegisterComponent implements OnInit {
  public countries: Observable<CountrySelect[]>;
  public acceptAGB: boolean;
  public formatEmail: boolean;
  public formatVorname: boolean;
  public formatNachname: boolean;
  public formatPassword: boolean;
  public formatBirthday: boolean;
  public formatPhone: boolean;
  // public formatEmailRe: boolean;
  public formatGender: boolean;
  public formatZipCode: boolean;
  public formatCity: boolean;
  public formatStreet: boolean;
  
  public startDate: Date;

  public input: RegisterFormInput = {
    phone: '' as string,
    gender: '' as string,
    title: '' as string,
    email: '' as string,
    email_re: '' as string,
    password: '' as string,
    password_re: '' as string,
    firstname: '' as string,
    lastname: '' as string,
    birthday: undefined,
    country: { value: 'AT', viewValue: 'Austria' } as CountrySelect,
    zipcode: '' as string,
    city: '' as string,
    street: '' as string
  };

  constructor(private checkProvider: CheckService, private countryService: CountryService) {
    this.countries = this.getCountries();
    this.startDate = new Date(1990, 0, 1);
  }

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
  setFormValidation(value: boolean): void {
    this.formatEmail = value;
    this.formatNachname = value;
    this.formatVorname = value;
    this.formatPassword = value;
    this.formatBirthday = value;
    this.formatPhone = value;
    // this.formatEmailRe = value;
    this.formatGender = value;
    this.formatCity = value;
    this.formatStreet = value;
    this.formatZipCode = value;
  }

  /**
   * validates all form data
   * @param userInput the input data from register form
   */
  validateRegister(userInput: RegisterFormInput): boolean {
    userInput.email = this.trimInput(userInput.email, false);
    userInput.password = this.trimInput(userInput.password, true);
    userInput.password_re = this.trimInput(userInput.password_re, true);
    userInput.firstname = this.trimInput(userInput.firstname, false);
    userInput.lastname = this.trimInput(userInput.lastname, false);
    userInput.phone = this.trimInput(userInput.phone, false);
    userInput.city = this.trimInput(userInput.firstname, false);
    userInput.street = this.trimInput(userInput.firstname, false);
    userInput.zipcode = this.trimInput(userInput.firstname, false);

    this.setFormValidation(true);

    if (userInput.gender === '') {
      this.formatGender = false;
    }

    if (!this.checkProvider.checkEmail(userInput.email)) {
      this.formatEmail = false;
    }

    /* if (!this.checkProvider.checkEmail(userInput.email_re) || userInput.email !== userInput.email_re) {
      this.formatEmailRe = false;
    } */

    if (!this.checkProvider.checkPassword(userInput.password)) {
      this.formatPassword = false;
    }

    if (!this.checkProvider.checkString(userInput.firstname, 3, 15)) {
      this.formatVorname = false;
    }

    if (!this.checkProvider.checkString(userInput.lastname, 3, 15)) {
      this.formatNachname = false;
    }

    /* if (!userInput.birthday) {
      this.formatBirthday = false;
    } */

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
      // this.formatEmailRe &&
      // this.formatGender &&
      this.formatCity &&
      this.formatZipCode &&
      this.formatStreet
    );
  }

  /**
   * Trims an input
   * @param value the value to trim
   * @param trimStartEnd if true replace trailing and leading whitespace; if false replace all
   */
  private trimInput(value: any, trimStartEnd: boolean): string {
    value = value.toString();
    return trimStartEnd ? value.trim() : value.replace(/ /g, '');
  }

  /**
   * Performs register if input data is correct
   * @param input the form input
   */
  performRegister(input: RegisterFormInput) {
    if (this.validateRegister(input)) {
      console.log('validated correctly');
    } else {
      console.log('validation failed');
    }
  }
  
  /**
   * Display Countries
   */
  getCountries(): Observable<CountrySelect[]> {
    return this.countryService.getCountries(LSC.EN);
  }
}
