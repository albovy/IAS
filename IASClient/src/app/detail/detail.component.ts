
import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/_services/image.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Image } from '../_models/image';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public picture : Image;
  isUserImage = false;
  modifying = false;
  user = "";
  description = "[No description]";

  constructor( 
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute,
    )
    {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('snapshot'+this.route.snapshot);
    this.imageService.detail(id)
    .subscribe(
        data => {
          console.log(data);
          this.picture = data.body;
          this.isUserImage = this.picture.public;
          this.user = this.picture.username;
          this.description = this.picture.description;
        },
        error => {
          console.log(error);
        });
  }
  deleteImage(){
    this.imageService.delete(this.picture._id)
    .subscribe(
        data => {
          console.log(data);
          if (data.status === 200){
            console.log('PICTURE DELETED');
            this.router.navigate(['/home']);
          }
        },
           
        error => {
          console.log(error);
        });
  }
  onClickModify(){
  this.modifying = true; 
 }
  onClickSave(){
    this.modifying = false;
    //TO DO:
    //Pillar el contenido de text area y meterlo en this.picture.description
    //console.log(this.picture.description);
    //TO DO:
    //CON PUT (CREAR EN IMAGE SERVICE TB)
    //enviar picture a back otra vez cuando esté upload
 }
 
}