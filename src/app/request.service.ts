import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  baseUrl : string ="http://localhost:8080/api/requests"
  constructor(private httpClient: HttpClient) { }

  saveRequests(userId, requests){
    this.sanitizeRequests(requests);
    return this.httpClient.post(this.baseUrl+"/"+userId, requests);
  }
  
  getCitizenRequests(id){
    return this.httpClient.get(this.baseUrl+"/citizens/"+id+"/requests");
  }

  getCitizenOnHoldRequests(id){
    return this.httpClient.get(this.baseUrl+"/citizens/"+id+"/requests-onhold");
  }

  deleteCitizenRequest(id){
    return this.httpClient.delete(this.baseUrl+"/"+id, {responseType: 'text'});
  }

  acceptRequests(id, requests){
    return this.httpClient.patch(this.baseUrl+"/"+id+"/accept", requests);
  }

  updateRequestStatus(id, request){
    return this.httpClient.patch(this.baseUrl+"/"+id+"/finish", request, {responseType: 'text'});
  }

  sanitizeRequests(requests){
    for(let i=0;i<requests.length;i++){
      if(requests[i].quantity==""){
        requests[i].quantity=null;
      }
    }
  }
}
