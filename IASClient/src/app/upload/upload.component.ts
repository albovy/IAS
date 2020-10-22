import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../_services/image.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadForm: FormGroup;
  img_value = "";

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      img: [null, Validators.required],
      public: [true, Validators.required],
      description: ['',Validators.required],
    });
  }
  get form() { return this.uploadForm.controls; }

  onFileChange(event) {
    
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        fileSource: file
      });
      console.log(file);
      this.img_value = file;

    }
  }
  onSubmit() {

    //this.img_value = this.form.img.value.replace("C:\\fakepath\\", "");

    console.log(this.img_value, this.form.public.value, this.form.description.value);

    this.imageService.upload(this.img_value, this.form.public.value, this.form.description.value)
    .subscribe(
        data => {
          console.log(data);
          if (data === 200){
            this.router.navigate(['/home']);
          }
        },
        error => {
          console.log('Error uploading');
        });
  }

}
