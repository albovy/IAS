import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IASClient';
  faUser = faUser
  
  isLogged = false

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLogged = false

    const needToken = this.userService.needToken;
    console.log(needToken);
    
    
    if (needToken){
      console.log('Redirect to login');
      this.router.navigate(['login']);      
    }
  }

  public get needToken(): boolean {
    const x = this.userService.needToken;
    console.log(x);
    return x;
    

  }
}
