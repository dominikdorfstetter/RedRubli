import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError, flatMap, map, shareReplay } from 'rxjs/operators';
import { FetchService } from './fetch.service';

/*  interfaces for country object
  ==============================*/
export interface Country {
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

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private fetchService: FetchService) { }

  /*  fetch countries from API
  ============================*/
  fetchCountries = (): Observable<any> => {
    return this.fetchService.fetchData(API_URL).pipe(
      flatMap((response: Response) => response.json()),
      catchError(err => of(err)),
      shareReplay());
  }

  /*  get countries localized as string array
  ==========================================*/
  getCountries(lsc: LSC): Observable<string[]> {
    return this.fetchCountries().pipe(
      map((countries: Country[]) => 
          countries.map((country: Country) => 
              (lsc === LSC.EN) ? country.name : country.translations[lsc])));
  }
}
