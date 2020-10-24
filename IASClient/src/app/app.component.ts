import { Component } from '@angular/core';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
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
  faExit = faSignOutAlt
  
  isLogged = false

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLogged = false;
  }

  public get tokenFound() {
    return this.userService.currentUserValue !== null;
  }

  public logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}
