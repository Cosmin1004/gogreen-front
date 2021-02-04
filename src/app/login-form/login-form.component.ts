import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  userData ={};
  validationMessage: string;
  constructor(
    private userService: UserService, 
    private router : Router,
    private loginService: LoginService) { }

  ngOnInit() {
  }

  login(){
    this.loginService.login(this.userData).subscribe(
      resp=>{
        this.userService.setCurrentUser(resp);
        this.validationMessage=null;
        if(this.userService.getCurrentUser().role=='CITIZEN'){
           this.router.navigate(['/citizen-dashboard']);
        }
        else{
          if(this.userService.getCurrentUser().role=='COMPANY'){
            this.router.navigate(['/company-dashboard']);
          }
        }
        
      },
      err=>{
        this.validationMessage = err.error;
      }
    )
    
  }

}
