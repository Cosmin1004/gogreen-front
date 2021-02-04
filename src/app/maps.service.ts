import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private baseUriUsers="http://localhost:8080/api/users/";
  constructor(private httpClient : HttpClient) { }

  geocodeAddress(user) {
    let params = {
      "app_id": 'Io8S7HuCUrNlW1DlHDSl',
      "app_code": '0ZXkzYRra7N0VMjDUVhlMg',
    }
    params['searchtext'] = user.street + "+" +user.number +"+Iasi+Romania";
    return this.httpClient.get('https://geocoder.api.here.com/6.2/geocode.json',
      { 'params': params }
    );
  }

  getNearbyUsersByCoordinates(lat, lng, id){
    return this.httpClient.get(this.baseUriUsers+"nearby-users-after-moving?latitude="+lat+"&longitude="+lng+"&id="+id);
  }

  getNearbyUsersForCompany(id){
    return this.httpClient.get(this.baseUriUsers+"nearby-users-for-company/"+id);
  }

  getNearbyUsersForCitizen(id){
    return this.httpClient.get(this.baseUriUsers+"nearby-users-for-citizen/"+id);
  }
}
