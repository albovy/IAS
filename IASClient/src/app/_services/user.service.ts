import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserToken: BehaviorSubject<string>;
  private username: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
      this.currentUserToken = new BehaviorSubject<string>(localStorage.getItem('userToken'));
      this.username = new BehaviorSubject<string>(localStorage.getItem('username'));
  }

  public get currentUserValue() {
    return this.currentUserToken.value;
  }

  public get currentUsername() {
    return this.username.value;
  }

  login(username, password) {
    return this.http.post( `${environment.apiUrl}/login`, { username, password }, {observe: 'response'}).pipe(
      map(response => {
        if (response.status === 200) {
          localStorage.setItem('userToken', response.body.toString());
          localStorage.setItem('username', username);
          this.currentUserToken.next(response.body.toString());
          this.username.next(username);
          return true;
        }
      }),
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
        } else {
            errorMsg = this.getServerErrorMessage(error);
        }

        return throwError(errorMsg);
      })
    );
  }
  
  register(username, password) {
    return this.http.post( `${environment.apiUrl}/users`,{ username, password }, { observe: 'response' }).pipe(
      map(response => {
        if (response.status === 200) {
          return true;
        }
      }),
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
        } else {
            errorMsg = this.getServerErrorMessage(error);
        }
        return throwError(errorMsg);
      })
    );
  }

  logout() {
     localStorage.removeItem('userToken');
     this.currentUserToken.next(null);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            if (error.error.message) return error.error.message;
            else return `Not Found: ${error.message}`;
        }
        case 403: {
            if (error.error.message) return error.error.message;
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
    }
  }

}
