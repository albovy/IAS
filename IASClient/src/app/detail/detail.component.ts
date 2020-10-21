import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/_services/image.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  isUserImage = false;
  constructor( 
    private imageService: ImageService,
    private router: Router,
    )
    {}

  ngOnInit(): void {
  }

  onClickModify(){
    this.router.navigate(['/upload']); //aqui habra que pasar la info o algo
  }
}
