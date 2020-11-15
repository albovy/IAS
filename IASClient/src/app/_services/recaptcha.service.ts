import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, publishBehavior } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Recaptcha } from '../_models/recaptcha';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  constructor(private http: HttpClient) { }

  validate(recaptcha) {
    return this.http.post<Recaptcha>( `${environment.apiUrl}/validation`, {recaptcha}, { observe: 'response' })
        .pipe(map(response => {
          return response.body.success;
        }));
  }
}
