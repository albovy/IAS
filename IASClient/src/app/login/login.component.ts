import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service'
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = "";
  errorMsg = "";
  hasError = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    
  }

  ngOnInit(): void {
     if (this.userService.currentUserValue != null){
       this.router.navigate(['home']);
     }

    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  // For easy access to form fields
  get form() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.userService.login(this.form.username.value, this.form.password.value)
            .subscribe(
                data => {
                  if (data) {
                    this.router.navigate(['/home']);
                  }
                },
                error => {
                    this.hasError = true;
                    this.errorMsg = error;
                    this.loading = false;
                });
  }
}   
