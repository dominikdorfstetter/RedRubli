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

  fetchData(url: string): Observable<Response> {
    const fetchData = Observable.create(observer => {
      fetch(`${url}`)
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });

    return fetchData;
  }
}
