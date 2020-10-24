import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  //current active route
  routeURL: string;

  constructor(private userService: UserService, private router: Router) {
    // initialize 'routeURL' with current route URL
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = this.userService.currentUserValue;

        if (token === null && this.routeURL !== '/login') {
          this.routeURL = '/login';
          this.router.navigate(['/login']);
          return resolve(false);
        } else {
          this.routeURL = this.router.url;
          return resolve(true);
        }
    });
  }
}