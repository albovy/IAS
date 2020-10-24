import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, empty, Observable, of, Subject, throwError } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators/'; 
import { UserService } from '../_services/user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private userService: UserService
    ){}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this.userService.currentUserValue;
        
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned).pipe(
              catchError((response: HttpErrorResponse) => {
                if (response.status === 401 ||response.status === 403){
                    alert('Token not valid or not present? Redirecting to login1')
                    this.userService.logout();
                    this.router.navigate(['login']);
                }
                return EMPTY;
              })  
            );
        }
        else {
            return next.handle(req).pipe(
                catchError((response: HttpErrorResponse) => {
                  if (response.status === 401 || response.status === 403){
                      alert('Token not valid or not present? Redirecting to login1')
                      this.userService.logout();
                      this.router.navigate(['login']);
                  }
                  return EMPTY;
  
                })  
              );
        }
    }
}
