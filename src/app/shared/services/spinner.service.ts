import {
  Injectable
} from '@angular/core';
import {
  Subject, BehaviorSubject
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isLoading = new BehaviorSubject < boolean > (false);

  constructor() {}

  public get loading() {
    return this.isLoading.value;
  }

  public show() {
    this.isLoading.next(true);
  }

  public hide() {
    this.isLoading.next(false);
  }

}
