import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError} from 'rxjs/operators/'; 
import { UserService } from '../_services/user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    routeUrl : string;

    constructor(
        private router: Router,
        private userService: UserService
    ){
        this.routeUrl = this.router.url;
    }

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
                    return this.handleError(response, this.routeUrl);
                })  
            );
        }
        else {
            return next.handle(req).pipe(
                catchError((response:HttpErrorResponse) => {
                    return this.handleError(response, this.routeUrl);
                }) 
            );
        }
    }
    

    private handleError(response: HttpErrorResponse, routeUrl:string) {
        if (routeUrl === '/login') return throwError(response);
        else if (response.status === 401 || response.status === 403){
            alert('Token not valid or not present. Redirecting to login')
            this.userService.logout();
            this.router.navigate(['login']);
        }
        return throwError(response);
    }
}
