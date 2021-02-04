import { Injectable, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  private isLoggedIn: any;
  currentUser: any;
  defaultLatitude = 47.1559548;
  defaultLongitude = 27.5874343;
  localStorage = window.localStorage;

  constructor(private loginService: LoginService) {
    this.updateUserInfo(null);
  }

  ngOnInit() {
    this.updateUserInfo(null);
  }

  setLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  getLoggedIn() {
    return this.isLoggedIn;
  }

  setCurrentUser(user) {
    this.populateCurrentUser(user);
    if (this.currentUser) {
      this.localStorage.setItem("user", this.currentUser.id);
      this.localStorage.setItem("lat", this.currentUser.latitude);
      this.localStorage.setItem("lng", this.currentUser.longitude);
      this.setLoggedIn(true);
    }
  }

  populateCurrentUser(user) {
    if (user) {
      this.currentUser = {};
      this.currentUser.role = user.role;
      this.currentUser.id = user.id;
      this.currentUser.latitude = user.latitude;
      this.currentUser.longitude = user.longitude;
      this.currentUser.email = user.email;
      if (user.role == "CITIZEN") {
        this.currentUser.username = user.firstname + " " + user.lastname;
        this.currentUser.address = user.citizenAddress;
        this.currentUser.phoneNumber = user.citizenPhoneNumber;
      } else {
        this.currentUser.companyName = user.companyName;
        this.currentUser.uniqueCode = user.uniqueCode;
        this.currentUser.address = user.companyAddress;
        this.currentUser.phoneNumber = user.companyPhoneNumber;
      }
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }
  removeUser() {
    this.localStorage.removeItem("user");
    this.currentUser = null;
    this.setLoggedIn(false);
  }

  updateCurrentUser(id, cb) {
    localStorage.setItem("user", id);
    this.updateUserInfo(cb);
  }

  updateUserInfo(cb) {
    if (this.localStorage.getItem("user") && !this.currentUser) {
      this.loginService.getUserData(this.localStorage.getItem("user")).subscribe(
        resp => {
          this.setCurrentUser(resp);
          if(cb){
            cb();
          }
        },
        err => {
          console.log(err);
        }
      )
    }
  }

}
