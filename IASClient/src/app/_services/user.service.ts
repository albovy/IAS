import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Picture } from '../_models/pictures';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserToken: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
      this.currentUserToken = new BehaviorSubject<string>(localStorage.getItem('userToken'));
  }

  public get currentUserValue() {
    return this.currentUserToken.value;
  }

  login(username, password) {
    return this.http.post( `${environment.apiUrl}/login`, { username, password }, { observe: 'response' })
    .pipe(map(response => {
      if (response.status === 200) {
        localStorage.setItem('userToken', response.body.toString());
        return true;

      }
      return false;
    }));
  }
  
  register(username, email, password) {
    return this.http.post( `${environment.apiUrl}/users`,{ username, email, password }, { observe: 'response' })
        .pipe(map(response => {
          console.log(response);
            return response.status;
        }));
  }

  logout() {
    // TODO:
    // remove user from local storage and set current user to null
    // localStorage.removeItem('currentUser');
    // this.currentUserSubject.next(null);
  }

  getAll() {
    return this.http.get<Picture[]>(`${environment.apiUrl}/pictures`, { observe: 'response'})
        .pipe(map(response => {
          if (response.status === 200) {
            return response.body;  
          }
          
        }))
  }

}
