import {
  Injectable
} from '@angular/core';
import {
  Observable, of
} from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  constructor() {}

  /*  fetch data from a URL
  =========================*/
  fetchData(url: string): Observable<Response> {
    const response$ = Observable.create(observer => {
      fetch(`${url}`)
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });

    return response$;
  }

  /**
   * Fetch JSON from a response
   * @param url URL that we want to fetch
   */
  fetchJSON(url: string): Observable<any> {
    return this.fetchData(url).pipe(
        flatMap((response: Response) => response.json()),
        catchError(err => of(err)
      )
    )
  }

  /**
   * Fetch Blob from a response
   * @param url URL that we want to fetch
   */
  fetchBlob(url: string): Observable<Blob> {
    return this.fetchData(url).pipe(
        flatMap((response: Response) => response.blob()),
        catchError(err => of(err)
      )
    )
  }

  /**
   * Fetch string from a response
   * @param url URL that we want to fetch
   */
  fetchText(url: string): Observable<string> {
    return this.fetchData(url).pipe(
        flatMap((response: Response) => response.text()),
        catchError(err => of(err)
      )
    )
  }

}
