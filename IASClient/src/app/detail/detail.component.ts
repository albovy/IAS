
import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/_services/image.service';
import { Router, ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  isUserImage = true;
  modifying = false;
  user = "@user";
  description = "This is a description of the picture above";

  constructor( 
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute,
    )
    {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.imageService.detail(id)
    .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
  deleteImage(){
    
  }
  onClickModify(){
  this.modifying = true; 
 }
  onClickSave(){
    this.modifying = false;
 }
 
}