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


        //const idToken = localStorage.getItem("userToken");

        const idToken = this.userService.currentUserValue;

        // Unic endpoint on NO es necessari token -> LOGIN

        if (req.url === 'http://localhost:3000/api/login'){
            return next.handle(req);
        }

        
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned).pipe(
              catchError((response: HttpErrorResponse) => {
                if (response.status === 401){
                    alert('Token not valid or not present? Redirecting to login1')
                    this.userService.logout();
                    this.router.navigate(['login']);
                }
                return EMPTY;

              })  
            );
        }
        else {
            console.log(req.url);            
            alert('Token not valid or not present? Redirecting to login2')
            this.router.navigate(['login']);
            return EMPTY;
        }
    }
}
