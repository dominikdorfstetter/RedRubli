import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate  {

  constructor(private userS: UserService, private logS: LoggerService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.userS.getUser().pipe(
      take(1),
      map(user => {
        return !!user && user.roles.customer ? true : false
      }),
      tap((isSales: boolean) => {
        if(!isSales) {
          this.logS.logError('Access denied, customers only');
        }
      })
    );
  }
}
