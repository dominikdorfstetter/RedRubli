import { Injectable, OnInit } from '@angular/core';
import { of, Observable, Subscription, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { retry, switchMap, catchError, flatMap, tap, map } from 'rxjs/operators';
import { FetchService } from './fetch.service';

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


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  countries: Country;
  countriesS: Subscription;

  constructor(private fetchService: FetchService) { }

  fetchCountries = (): Observable<any> => {
    return this.fetchData('https://restcountries.eu/rest/v2/all');
  }

  getCountries(lsc: LSC): Observable<string[]> {
    return this.fetchCountries().pipe(
      map((countries: Country[]) => 
          countries.map((country: Country) => 
              (lsc === LSC.EN) ? country.name : country.translations[lsc])));
  }

  fetchData(url: string): Observable<Response> {
    if(!!url)
      return this.fetchService.fetchData(url).pipe(
                  flatMap((response: Response) => response.json()),
                  catchError(err => of(err)));
    else
        return of(null);
  }
}
