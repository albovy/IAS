
import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/_services/image.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Image } from '../_models/image';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { faEdit, faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public picture : Image;
  isUserImage = false;
  modifying = false;
  descriptionForm: FormGroup;
  isLoading = false;
  faSave = faSave;
  faEdit = faEdit;
  faTrash = faTrashAlt

  constructor( 
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
    )
    {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    const currentUser = this.userService.currentUsername;
    this.imageService.detail(id).subscribe(
        data => {
          this.picture = data;
          this.isLoading = false;
          this.isUserImage = data.username === currentUser;
        },
        error => {
          console.log(error);
          this.isLoading = false
        }
    );

    this.descriptionForm = this.formBuilder.group({
      newDescription: [''],
    });
  }

  get form() { return this.descriptionForm.controls; }

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
    this.picture.description = this.form.newDescription.value;
    this.imageService.update(this.picture._id, this.picture.description)
    .subscribe(
        data => {
          console.log(data);
          if (data.status === 200){
            console.log('PICTURE UPDATED');
            this.ngOnInit();
          }
        },
           
        error => {
          console.log(error);
        });
  
   }
 
}