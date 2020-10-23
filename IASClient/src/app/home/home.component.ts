import { Component, OnInit } from '@angular/core';
import { ImageService } from '../_services/image.service'
import { Image } from '../_models/image'
import { Router, RouterModule } from '@angular/router';
import { errorMonitor } from 'events';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public pictures : Image[];

  constructor(private imageService: ImageService, private router: Router) {
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
          if (error.status === 401){
            return this.router.navigateByUrl('/login');
          }
          console.log(error)
          // this.loading = false;
      }
    );
    
  }

}
