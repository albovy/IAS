import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from 'src/app/_services/image.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @Input() id : string;

  isUserImage = false;
  constructor( 
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
    )
    {}

  ngOnInit(): void {
    //TODO: Llamar al BE para pedir la informacion de la imagen.
    this.route.data.subscribe(data => console.log(data));
  }

  onClickModify(){
    this.router.navigate(['/upload']); //aqui habra que pasar la info o algo
  }
}
