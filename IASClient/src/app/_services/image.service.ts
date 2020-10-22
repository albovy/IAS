import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Image } from '../_models/image';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  } 
  
  detail(id) {
    return this.http.get<Image>( `${environment.apiUrl}/pictures/`+id,{ observe: 'response' })
        .pipe(map(response => {
          console.log(response);
            return response.status;
        }));
  }

  getAll() {
    return this.http.get<Image[]>(`${environment.apiUrl}/pictures`, { observe: 'response'})
        .pipe(map(response => {
          if (response.status === 200) {
            return response.body;  
          }
          
        }))
  }
  
  upload(img, publicImg, description) {
    return this.http.post( `${environment.apiUrl}/pictures`,{ img, publicImg, description }, { observe: 'response' })
        .pipe(map(response => {
          console.log(response);
            return response.status;
        }));
  }

}
