import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { FetchService } from './fetch.service';
import { Serializable } from './serializable';

export class Country extends Serializable implements CountryInterface {
  name: string;  topLevelDomain?: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes?: string[];
  capital: string;
  altSpellings?: string[];
  region: string;
  subregion: string;
  population: number;
  latlng?: number[];
  demonym: string;
  area: number;
  gini: number;
  timezones?: string[];
  borders?: string[];
  nativeName: string;
  numericCode: string;
  currencies?: CurrenciesEntity[];
  languages?: LanguagesEntity[];
  translations: Translations;
  flag: string;
  regionalBlocs?: RegionalBlocsEntity[];
  cioc: string;
}

/*  interfaces for country object
  ==============================*/
export interface CountryInterface {
  name: string;
  topLevelDomain?: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes?: string[];
  capital: string;
  altSpellings?: string[];
  region: string;
  subregion: string;
  population: number;
  latlng?: number[];
  demonym: string;
  area: number;
  gini: number;
  timezones?: string[];
  borders?: string[];
  nativeName: string;
  numericCode: string;
  currencies?: CurrenciesEntity[];
  languages?: LanguagesEntity[];
  translations: Translations;
  flag: string;
  regionalBlocs?: RegionalBlocsEntity[];
  cioc: string;
}

export interface CurrenciesEntity {
  code: string;
  name: string;
  symbol: string;
}

export interface LanguagesEntity {
  iso639_1: string;
  iso639_2: string;
  name: string;
  nativeName: string;
}

export interface Translations {
  de: string;
  es: string;
  fr: string;
  ja: string;
  it: string;
  br: string;
  pt: string;
}

export interface RegionalBlocsEntity {
  acronym: string;
  name: string;
  otherAcronyms?: (string);
  otherNames?: (string);
}

/*  language short codes
  =======================*/
export enum LSC {
  DE='de',
  FR='fr',
  EN='en',
  ES='es'
}

const API_URL = 'https://restcountries.eu/rest/v2/all';

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private fetchService: FetchService) { }


  /** fetch countries from API
   *  @returns Observable<Country[]> Observable of countries
   */
  fetchCountries(): Observable<Country[]> {
    return this.fetchService.fetchJSON(API_URL).pipe(
      map(res => {
        return res.map(el => new Country(el));
      }),
      shareReplay()) as Observable<Country[]>;
  }

  /**
   * get countries localized as string array
   * @param lsc Language Short Code
   */
  getCountries(lsc: LSC): Observable<string[]> {
    return this.fetchCountries().pipe(
      // if language is english return country.name
      // if not, return the translation for it
      map((countries: Country[]) => 
          countries.map((country: Country) => 
              (lsc === LSC.EN) ? country.name : country.translations[lsc])));
  }
}
