import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service'
import { Picture } from 'src/app/_models/pictures'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  test : Picture[];

  constructor(private userService: UserService) {
   }

  ngOnInit(): void {
    this.userService.getAll().subscribe(
      data => {
        this.test = data;
        console.log(data)
        // if (data) {
          // this.router.navigate(['/home']);
        // }
      },
      error => {
          //TODO: show error message
          console.log(error)
          // this.loading = false;
      }
    );
    
  }

}
