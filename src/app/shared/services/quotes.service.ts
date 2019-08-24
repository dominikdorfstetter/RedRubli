import { Injectable } from '@angular/core';
import { Serializable } from './serializable';
import { FetchService } from './fetch.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, first, take, tap } from 'rxjs/operators';

const API_URL = 'http://quotes.rest/qod.json';

export class Quote extends Serializable implements QuotesInterface {
  success: Success;  
  contents: Contents;
}

export interface QuotesInterface {
  success: Success;
  contents: Contents;
}
 
export interface Success {
  total: number;
}

export interface Contents {
  quotes?: (QuotesEntity)[] | null;
  copyright: string;
}

export interface QuotesEntity {
  quote: string;
  length: string;
  author: string;
  tags?: (string)[] | null;
  category: string;
  date: string;
  permalink: string;
  title: string;
  background: string;
  id: string;
}


@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private lastQuote$ = new BehaviorSubject<Quote>(undefined);

  constructor(private fetchS: FetchService) { }

  public get quote() {
    return this.lastQuote$.value;
  }

  public getNewQuote() {
    this.fetchQuoteOfTheDay().subscribe(
      (quote: Quote) => {
        this.lastQuote$.next(quote);
      },
      err => {
        console.error('something happened..' + err);
      }
    )
  }

  /** fetch a single quote from API
   *  @returns Observable<Quote>
   */
  fetchQuoteOfTheDay(): Observable < Quote > {
    return this.fetchS.fetchJSON(API_URL).pipe(
      first(),
      tap(console.table),
      map(res => { return new Quote(res); }),
      catchError(err => { throw err; })) as Observable < Quote > ;
  }
}
