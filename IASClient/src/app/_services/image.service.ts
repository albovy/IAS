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
    return this.http.get<Image>( `${environment.apiUrl}/pictures/download/`+id,{ observe: 'response' })
        .pipe(map(response => {
          console.log(response);
            return response.status;
        }));
  }

}
