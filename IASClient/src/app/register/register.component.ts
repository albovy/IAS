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

  checkStrength(p) {
    // 1
    let force = 0;
  
    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);
  
    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];
  
    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }
  
    // 5
    force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
    force += passedMatches * 10;
  
    // 6
    force = (p.length <= 6) ? Math.min(force, 10) : force;
  
    // 7
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;
  
    return force;
  }

  

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  // For easy access to form fields
  get form() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    console.log(this.checkStrength(this.registerForm.controls["password"].value));


    

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    if (this.checkStrength(this.registerForm.controls["password"].value) < 20){
      this.errorMessage = "Password is not strong enough: try adding uppercase and lowercase letters, numbers or symbols.";
      this.hasError = true;
      this.loading = false;
      return;
    }



    this.loading = true;

    this.userService.register(this.form.username.value, this.form.password.value)
    .subscribe(
        data => {
          if (data){
            this.userService.login(this.form.username.value, this.form.password.value)
            .subscribe(
                data => {
                  if (data) {
                    this.router.navigate(['/home']);
                  }
                },
                error => {
                    this.hasError = true;
                    this.loading = false;
                });
            //this.router.navigate(['/login']);
          }
        },
           
        error => {
          this.errorMessage = error;
          this.hasError = true;
          this.loading = false;
        });


  }   
}
