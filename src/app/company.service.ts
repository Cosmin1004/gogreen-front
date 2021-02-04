import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  baseUrl: string = "http://localhost:8080/api/companies";
  constructor(private httpClient: HttpClient) { }

  public companyRegistration(company, materials) {
    var materialName = [];
    if (materials) {
      for (let i = 0; i < materials.length; i++) {
        if (materials[i].checked == true) {
          materialName.push(materials[i].name);
        }
      }
    }
    company.materialName = materialName;
    return this.httpClient.post(this.baseUrl, company);
  }

  getAcceptedRequests(id){
    return this.httpClient.get(this.baseUrl+"/"+id+"/accepted-request");
  }

  getAllRecyclingStations(){
    return this.httpClient.get("http://localhost:8080/api/users/companies/hover-info");
  }
}
