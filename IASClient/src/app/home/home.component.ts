import { Component, OnInit } from '@angular/core';
import { ImageService } from '../_services/image.service'
import { Image } from '../_models/image'
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public pictures : Image[];

  constructor(private imageService: ImageService) {
   }

  ngOnInit(): void {
    this.imageService.getAll().subscribe(
      data => {
        this.pictures = data;
        console.log(data)
        // if (data) {
          // this.router.navigate(['/home']);
        // }
      },
      error => {
          //TODO: show error message
          console.log(error)
          // this.loading = false;
      }
    );
    
  }

}
