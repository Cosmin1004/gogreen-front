import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  baseUrl: string = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) { }

  public citizenRegistration(citizen) {

    var hasAddress = citizen.street && citizen.number && citizen.building && citizen.entrance && citizen.appNumber;
    return this.httpClient.post(this.baseUrl + "citizens", citizen);
  }

  getAllMaterials() {
    return this.httpClient.get(this.baseUrl + "materials");
  }

  public getNearbyCitizens(userId){
    return this.httpClient.get(this.baseUrl+"/citizens/nearby-citizens/"+userId);
  }

}
