import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseURI="http://localhost:8080/api/users";

  constructor(private httpClient : HttpClient) { }

  login(userData){
    return this.httpClient.post(this.baseURI+"/login", userData);
  }

  getUserData(id){
    return this.httpClient.get(this.baseURI+"/"+id);
  }
  

}
