import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, publishBehavior } from 'rxjs/operators';
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
            return response;
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
    const formData = new FormData();
    formData.append('fichero', img);
    formData.append('description', description);
    formData.append('public', publicImg);

    return this.http.post( `${environment.apiUrl}/pictures`, formData, { observe: 'response' })
        .pipe(map(response => {
          console.log(response);
            return response.status;
        }));
  }
  delete(img_id){
    return this.http.delete( `${environment.apiUrl}/pictures/delete/`+img_id,  { observe: 'response' } )
    .pipe(map(response => {
      console.log(response);
        return response;
    }));
  }

  update(img_id, description){
    return this.http.put( `${environment.apiUrl}/pictures/`+img_id, {img_id, description}, { observe: 'response' })
    .pipe(map(response => {
      console.log(response);
        return response;
    }));
  }

}
