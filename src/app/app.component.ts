import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GoGreen';
  constructor(private userService: UserService){};

  isNotLogged(){
    return !this.userService.getLoggedIn();
  }
}
