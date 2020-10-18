import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service'
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = "";
  hasError = false;
  errorMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { 
    // redirect to home if already logged in
    
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: [''],
      email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      password: ['']
    });
  }

  // For easy access to form fields
  get form() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;

    this.userService.register(this.form.username.value, this.form.email.value, this.form.password.value)
    .subscribe(
        data => {
          console.log(data);
          if (data === 200){
            this.router.navigate(['/login']);
          }
        },
           
        error => {
          this.errorMessage = error.error.message;
          this.hasError = true;
          this.loading = false;
        });


  }   
}
