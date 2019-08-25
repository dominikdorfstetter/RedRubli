import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userS: UserService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot): boolean {
    if (this.userS.loggedIn) {
      return true;
    }
    // Navigate to the login page with extras
    this.router.navigate(['/start']);
    return false;
  }

}
