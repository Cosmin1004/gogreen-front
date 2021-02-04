import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit} from '@angular/core';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenService } from '../citizen.service';
import { RequestService } from '../request.service';
import { LoginService } from '../login.service';
import { MapsService } from '../maps.service';


@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.css']
})
export class CitizenDashboardComponent implements OnInit, AfterViewInit {
  citizenActions =[{"name":"My requests", "action": this.viewRequests.bind(this)}];
  requests =[{"unit":null, "quantity":null, "materialName":null}];
  units=["kg", "g"];
  materials: any;
  validationErrors ={};
  citizenRequests:any;
  componentType="CITIZEN";

  @ViewChild('myRequestsModal',{static:false}) myRequestsModal;
  @ViewChild('citizenMap',{static:false}) citizenMap;

  constructor(
    private userService: UserService, 
    private modalService: NgbModal, 
    private requestService: RequestService, 
    private citizenService: CitizenService,
    private loginService:LoginService,
    private mapsService: MapsService) { }

  ngOnInit() {
    this.getAllMaterials();
  }

  ngAfterViewInit(){
    this.getUserInfo();
  }

  viewRequests(){
     this.getCitizenRequests();
     this.open(this.myRequestsModal, 'xl');
  }

  updateMapInfo(user) {
    let info = {
      "title": user.firstname+" "+user.lastname,
      "content": user.citizenPhoneNumber,
      "id": this.userService.localStorage["user"],
      "icon": "CITIZEN"
    }
    let places = [];
    let companyPoint = { "lat": this.userService.localStorage["lat"], "lng": this.userService.localStorage["lng"], "info": info };
    this.mapsService.getNearbyUsersForCitizen(this.userService.localStorage["user"]).subscribe(
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
                userInfo.title=nearbyUser.name
                userInfo.content=`<div><i class="fas fa-recycle"></i> ${nearbyUser.citizenRequestsMaterials ? nearbyUser.citizenRequestsMaterials.join(","): ""}</div>`;
                break;
              default:
                break;
            }
            places.push({ "lat": nearbyUser.latitude, "lng": nearbyUser.longitude, "info": userInfo})
          });
          this.citizenMap.currentCompanyLocation = this.citizenMap.displayCurrentUserPoint(companyPoint);
          this.citizenMap.displayLocationsForCompany(places);
        }
      }
    )
  }

  getCitizenRequests(){
    this.requestService.getCitizenRequests(this.userService.getCurrentUser().id).subscribe(
      resp=>{
         this.citizenRequests = resp;
      },
      err=>{
        console.log(err);
      }
    )
  }

  open(content, size) {
    this.modalService.open(content, {size: size }).result.then((result) => {
      this.clearRequests();
    }, (reason) => {
      this.clearRequests();
    });
  }

  insertNewRequest(){
    if(this.requests){
       this.requests.push({"unit":null, "quantity":null, "materialName" :null});
    }
  }

  saveRequests(){
    let userId = this.userService.getCurrentUser().id;
    if(userId && this.requests.length>0){
      this.requestService.saveRequests(userId, this.requests).subscribe(
        resp=>{
          console.log(resp);
          this.validationErrors={};
          this.modalService.dismissAll();
        },
        err=>{
          this.validationErrors = err.error;
        }
      )
    }
    console.log(this.requests);
  }

  getAllMaterials(){
    this.citizenService.getAllMaterials().subscribe(
      (resp : Array<object>)=>{
        if(resp){
          this.materials=[];
          resp.forEach(element => {
            this.materials.push(element["materialName"])
          });
        }
      },
      err=>{
        console.log(err)
      }
    )
  }

  removeRequest(index){
    this.requests.splice(index, 1);
    this.validationErrors={};
  }

  clearRequests(){
    this.requests =[{"unit":null, "quantity":null, "materialName":null}];
    this.validationErrors = {};
  }

  deleteCitizenRequest(citizenRequest){
    if(citizenRequest && citizenRequest.id){
      this.requestService.deleteCitizenRequest(citizenRequest.id).subscribe(
        resp=>{
          console.log(resp);
          this.getCitizenRequests();
        },
        err=>{
          console.log(err);
        }
      )
    }
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

}
