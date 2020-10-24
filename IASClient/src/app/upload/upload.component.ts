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
  files: File[] = [];
  hasError = false;
  errorMsg = "";

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

  onFilesAdded(event) {
    if (this.files.length === 0) {
      this.files.push(...event.addedFiles);
    }
  }

  onRemove(event) {
		this.files.splice(this.files.indexOf(event), 1);
  }
  
  onSubmit() {
    if (this.files.length > 0) {
      this.imageService.upload(this.files[0], this.form.public.value, this.form.description.value)
      .subscribe(
          data => {
            console.log(data);
            if (data === 201){
              this.router.navigate(['/home']);
            }
          },
          error => {
            console.log('Error uploading');
            this.hasError = true;

          });
    }
    else {
      this.errorMsg = "No file selected";
      this.hasError = true;
    }
    
  }

}
