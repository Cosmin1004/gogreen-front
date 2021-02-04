import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { LoginService } from '../login.service';
import { CompanyService } from '../company.service';
import { CitizenService } from '../citizen.service';
import { RequestService } from '../request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.css']
})
export class CompanyDashboardComponent implements OnInit, AfterViewInit {

  companyActions = [{ "name": "My orders", "action": this.viewOrders.bind(this) }];
  companyOrders;
  citizenRequests;
  currentCitizenDisplayed;
  validationErrors = {};
  componentType = "COMPANY";

  @ViewChild('companyMap', { static: false })
  companyMap: any;

  @ViewChild('requestsModal', { static: false }) requestsModal;

  @ViewChild('ordersModal', { static: false }) ordersModal;

  constructor(private modalService: NgbModal, private mapsService:MapsService, private requestService: RequestService, private citizenService: CitizenService, private userService: UserService, private loginService: LoginService, private companyService: CompanyService) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.getUserInfo();
  }

  updateMapInfo(user) {
    let info = {
      "title": user.companyName,
      "content": user.companyPhoneNumber,
      "id": this.userService.localStorage["user"],
      "icon": "COMPANY"
    }
    let places = [];
    let companyPoint = { "lat": this.userService.localStorage["lat"], "lng": this.userService.localStorage["lng"], "info": info };
    this.mapsService.getNearbyUsersForCompany(this.userService.localStorage["user"]).subscribe(
      (resp: Array<any>) => {
        if (resp) {
          resp.forEach(nearbyUser => {
            let userInfo = {"id": nearbyUser.id, "title":"", "content":"", "icon":nearbyUser.role};
            switch(nearbyUser.role){
              case "COMPANY":
                userInfo.title=nearbyUser.companyName;
                userInfo.content=`<div><i class="fas fa-recycle"></i> ${nearbyUser.materialList ? nearbyUser.materialList.join(","): ""}</div><div>${nearbyUser.email} </div><div><i class="fas fa-phone-square-alt"></i> ${nearbyUser.companyPhoneNumber}</div><div><i class="fas fa-home"></i> ${nearbyUser.address}</div>`
                break;
              case "CITIZEN":
                userInfo.title=nearbyUser.name;
                break;
              default:
                break;
            }
            places.push({ "lat": nearbyUser.latitude, "lng": nearbyUser.longitude, "info": userInfo})
          });
          this.companyMap.currentCompanyLocation = this.companyMap.displayCurrentUserPoint(companyPoint);
          this.companyMap.displayLocationsForCompany(places);
        }
      }
    )
  }
  
  viewOrders() {
    this.getAcceptedRequests(true);
  }

  getUserInfo() {
    if (this.userService.localStorage.getItem("user")) {
      this.loginService.getUserData(this.userService.localStorage.getItem("user")).subscribe(
        resp => {
          this.updateMapInfo(resp);
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  displayCitizenRequests(id, title) {
    if (id && title) {
      this.currentCitizenDisplayed = { "id": id, "title": title };
    }

    this.requestService.getCitizenOnHoldRequests(id).subscribe(
      (resp: Array<any>) => {
        this.citizenRequests = resp;
        this.citizenRequests.forEach(request => {
          request.dateRequestAccepted = new Date();
        });
        this.modalService.open(this.requestsModal, { size: 'lg', backdrop: 'static' }).result.then((result) => {
          this.validationErrors={};
        }, (reason) => {
          this.validationErrors={};
        });
      },
      err => {

      }
    )

  }


  getAcceptedRequests(openModal) {
    this.companyService.getAcceptedRequests(this.userService.localStorage.getItem("user")).subscribe(
      resp => {
        this.companyOrders = resp;
        if (openModal) {
          this.modalService.open(this.ordersModal, { size: 'xl', backdrop: 'static' });
        }
      },
      err => {

      }
    )
  }

  processRequests() {
    let selectedRequests = this.arrayDeepCopy(this.citizenRequests);
    if (this.currentCitizenDisplayed) {
      let acceptedCitizenRequests = [];
      selectedRequests.forEach(citizenRequest => {
        if (citizenRequest.accepted) {
          delete citizenRequest.accepted;
          citizenRequest.dateRequestAccepted = new Date(citizenRequest.dateRequestAccepted).getTime();
          acceptedCitizenRequests.push(citizenRequest);
        }
      });
      console.log(acceptedCitizenRequests);
      if (acceptedCitizenRequests.length > 0) {
        this.requestService.acceptRequests(this.userService.localStorage.getItem("user"), acceptedCitizenRequests).subscribe(
          resp => {
            this.closeModalsAndClearCitizenData();
          },
          err => {
            this.validationErrors = err.error;
          }
        )
      }
    }
  }

  finalizeRequest(request) {
    if (request) {
      let requestToFinalize = { "id": request.id, "status": "COMPLETED" };
      this.requestService.updateRequestStatus(this.userService.localStorage.getItem("user"), requestToFinalize).subscribe(
        resp => {
          this.getAcceptedRequests(false);
        },
        err => {
          console.log(err);
        }
      )
    }

  }

  cancelRequest(request) {
    if (request) {
      let requestToFinalize = { "id": request.id, "status": "ON_HOLD" };
      this.requestService.updateRequestStatus(this.userService.localStorage.getItem("user"), requestToFinalize).subscribe(
        resp => {
          this.getAcceptedRequests(false);
        },
        err => {
          console.log(err);
        }
      )
    }

  }


  arrayDeepCopy(arrayToCopy) {
    if (arrayToCopy) {
      return JSON.parse(JSON.stringify(arrayToCopy));
    }
    return arrayToCopy;
  }


  closeModalsAndClearCitizenData() {
    this.modalService.dismissAll();
    this.citizenRequests = [];
    this.currentCitizenDisplayed = null;
    this.validationErrors = {};
  }

}
