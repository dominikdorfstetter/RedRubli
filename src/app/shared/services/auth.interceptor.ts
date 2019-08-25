import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userS: UserService) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userS.loggedIn) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this.userS.authToken}` },
      });
    }

    return next.handle(request);
  }
}
