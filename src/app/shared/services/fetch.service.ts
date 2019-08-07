import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';

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
}
