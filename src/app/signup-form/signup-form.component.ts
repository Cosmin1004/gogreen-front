import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CitizenService } from '../citizen.service';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private userService: UserService,
    private citizenService: CitizenService,
    private companyService: CompanyService,
    private mapsService: MapsService
  ) { }

  citizen: any = {};
  company: any = {};
  newMaterial: string;
  validationErrors = {};
  materials = [];
  isGDPRChecked: boolean;
  currentModal: any;

  ngOnInit() {
    this.setDefaultMaterials();
  }
  open(content) {
    this.currentModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static' })
      .result.then((result) => {
        this.resetForms();
      }, (reason) => {
        this.resetForms();
      });
  }

  registerCitizen() {
    this.validateAddressAndRegisterUser(this.citizen, this.saveCitizen.bind(this));
  }

  isGeocodingMatchQualityValid(addressInfo, matchQuality: any) {
    let validAddress= addressInfo && addressInfo.City=="Iași" && addressInfo.County=="Iași" && addressInfo.Country=="ROU";
    return validAddress && matchQuality.Country == 1 && (matchQuality.City == 1 || matchQuality.County == 1) && (matchQuality.Street && matchQuality.Street.length > 0 && matchQuality.Street[0] >= 0.6);
  }

  saveCitizen() {
    this.citizenService.citizenRegistration(this.citizen).subscribe(
      resp => {
        console.log(resp);
        if (resp["user_id"]) {
          this.userService.updateCurrentUser(resp["user_id"], this.navigateToCitizenDashboard.bind(this));
        }
        this.validationErrors = {};
        this.modalService.dismissAll();
        
      },
      error => {
        if (error) {
          this.validationErrors = error.error;
        }

      }

    );
  }

  navigateToCitizenDashboard(){
    this.router.navigate(['/citizen-dashboard']);
  }

  registerCompany() {
    this.validateAddressAndRegisterUser(this.company, this.saveCompany.bind(this));
  }

  saveCompany() {
    this.companyService.companyRegistration(this.company, this.materials).subscribe(
      resp => {
        console.log(resp);
        if (resp["user_id"]) {
          this.userService.updateCurrentUser(resp["user_id"], this.navigateToCompanyDashboard.bind(this));
        }
        this.validationErrors = {};
        this.modalService.dismissAll();
        
      },
      error => {
        if (error) {
          this.validationErrors = error.error;
        }
      }

    );
  }
  navigateToCompanyDashboard(){
    this.router.navigate(['/company-dashboard']);
  }
  addMaterial() {
    if (this.newMaterial) {
      this.materials.push({ "name": this.newMaterial, "checked": true });
      this.newMaterial = null;
    }
  }

  resetForms() {
    this.citizen = {};
    this.company = {};
    this.isGDPRChecked = false;
    this.setDefaultMaterials();
    this.validationErrors = {};
  }

  setDefaultMaterials() {
    this.materials = [
      { "name": "Plastic", "checked": false },
      { "name": "Metal", "checked": false },
      { "name": "Clothes", "checked": false },
      { "name": "Glass", "checked": false },
      { "name": "Used oil", "checked": false },
      { "name": "E-waste", "checked": false },
      { "name": "Paper", "checked": false },
      { "name": "Batteries", "checked": false },
      { "name": "Organic", "checked": false }
    ];
  }

  validateAddressAndRegisterUser(user, registerCb) {
    var hasAddress = user.street && user.number && user.building && user.entrance && user.appNumber;
    if (hasAddress) {
      this.mapsService.geocodeAddress(user).subscribe(
        (resp: any) => {
          const view = resp.Response.View
          if (view.length > 0 && view[0].Result.length > 0) {
            const location = view[0].Result[0].Location;
            if (this.isGeocodingMatchQualityValid(location.Address, view[0].Result[0].MatchQuality)) {
              user.latitude = location.DisplayPosition.Latitude;
              user.longitude = location.DisplayPosition.Longitude;
              registerCb();
            } else {
              this.validationErrors = { "street": "Address is not recognized by the system" };
            }
          } else {
            this.validationErrors = { "street": "Address is not recognized by the system" };
          }
        },
        err => {
          console.log("Error on geocoding address");
        }
      )
    } else {
      registerCb();
    }
  }
}
