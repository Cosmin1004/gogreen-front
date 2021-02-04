import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CitizenService } from '../citizen.service';
import { CompanyService } from '../company.service';
import { MapsService } from '../maps.service';
import { UserService } from '../user.service';
declare var H: any;
@Component({
  selector: 'here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.css']
})
export class HereMapComponent implements OnInit {

  @ViewChild("map", { static: true })
  public mapElement: ElementRef;

  @Input()
  public lat: any;

  @Input()
  public lng: any;

  @Input()
  public width: any;

  @Input()
  public height: any;

  private platform: any;

  private map: any;

  private ui: any;

  private companyIcon;
  private citizenIcon;
  private currentLocationIcon;
  currentUserPin;

  currentLocation: any;

  private places: any = [];
  citizenNeighbors=[];
  citizensNearbyMarkers = [];
  currentCompanyPin;
  companyNearbyMarkers = [];

  @Input()
  parentComponent: any;

  public constructor(private mapsService: MapsService, private userService: UserService, private companyService: CompanyService) { }

  public ngOnInit() {
    this.platform = new H.service.Platform({
      "app_id": 'Io8S7HuCUrNlW1DlHDSl',
      "app_code": '0ZXkzYRra7N0VMjDUVhlMg',
      useHTTPS: true
    });
    this.places = [];
    this.citizensNearbyMarkers = [];

    //this.places[0]={"lat" : this.lat  ,"lng": this.lng, "info" : {"title" : "Sc Salubris"}};
  }

  public ngAfterViewInit() {
    let pixelRatio = window.devicePixelRatio || 1;
    let defaultLayers = this.platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    this.map = new H.Map(this.mapElement.nativeElement,
      defaultLayers.normal.map, { pixelRatio: pixelRatio });

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);

    this.map.setCenter({ lat: this.lat, lng: this.lng });
    this.map.setZoom(14);

    this.displayPlaces(this.places);
    this.onMapClick();
  }

  private dropMarker(coordinates: any, data: any) {
    if (!this.companyIcon) {
      this.companyIcon = new H.map.Icon("/assets/img/company-pin.png");
    }
    if (!this.citizenIcon) {
      this.citizenIcon = new H.map.Icon("/assets/img/citizen-pin.png");
    }
    let icon = {};
    if (data.icon == "COMPANY") {
      icon["icon"] = this.companyIcon;
    } else {
      if (data.icon == 'CITIZEN') {
        icon["icon"] = this.citizenIcon;
      }
    }
    let marker = new H.map.Marker(coordinates, icon);
    marker.setData("<p>" + data.title + "<br></p>" + data.content);
    if(data.icon=="CITIZEN"){
      if(this.parentComponent.componentType=="COMPANY"){
        marker.addEventListener('tap', event => {
            this.parentComponent.displayCitizenRequests(data.id, data.title);
        }, false);
      }else{
        marker.addEventListener('pointerenter', event => {
          let bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
            content: event.target.getData()
          });
          this.ui.getBubbles().forEach(bub => this.ui.removeBubble(bub));
          this.ui.addBubble(bubble);
        }, false);
      }
        
    }else{
      marker.addEventListener('pointerenter', event => {
        let bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
          content: event.target.getData()
        });
        this.ui.getBubbles().forEach(bub => this.ui.removeBubble(bub));
        this.ui.addBubble(bubble);
      }, false);
    }
    this.map.addObject(marker);
    return marker;
  }

  public displayPlaces(places: any, currentLocation?) {
    let markers = [];
    for (let i = 0; i < places.length; i++) {
      markers.push(this.dropMarker({ "lat": places[i].lat, "lng": places[i].lng }, places[i].info));
      if (i == 0 && !currentLocation)
        this.map.setCenter({ lat: places[0].lat, lng: places[0].lng })
    }
    if (currentLocation && places.length>0){
      let centerLocation = currentLocation.b?currentLocation.b:currentLocation;
      this.map.setCenter(centerLocation);
    }
    this.map.setZoom(14);
    console.log(markers);
    return markers;
  }

  //display current location when user is logged in
  displayCurrentUserPoint(data) {
    let coordinates = { "lat": data.lat, "lng": data.lng };
    if (!this.currentUserPin) {
      this.currentUserPin = new H.map.Icon("/assets/img/current-user-pin.png");
    }
    let marker = new H.map.Marker(coordinates, {"icon":this.currentUserPin});
    this.map.addObject(marker);
    return marker;
  }

  mapClickForCompany(){
    let This = this;
    this.map.addEventListener('tap', function (evt) {
      if (!(evt.target instanceof H.map.Marker)) {
        var coord = this.screenToGeo(evt.currentPointer.viewportX,
          evt.currentPointer.viewportY);
        if (This.currentLocation) {
          This.map.removeObjects([This.currentLocation]);
        }
        let coords = { "lat": coord.lat, "lng": coord.lng }
        This.currentLocation = new H.map.Marker(coords, { "icon": This.currentLocationIcon });
        This.map.addObject(This.currentLocation);
        This.displayUsersNearby(coords, This);
      }
    });
  }

  mapClickForHome(){

  }

  mapClickForCitizen(){
    let This = this;
    this.map.addEventListener('tap', function (evt) {
      if (!(evt.target instanceof H.map.Marker)) {
        var coord = this.screenToGeo(evt.currentPointer.viewportX,
          evt.currentPointer.viewportY);
        if (This.currentLocation) {
          This.map.removeObjects([This.currentLocation]);
        }
        let coords = { "lat": coord.lat, "lng": coord.lng }
        This.currentLocation = new H.map.Marker(coords, { "icon": This.currentLocationIcon });
        This.map.addObject(This.currentLocation);
        This.displayUsersNearby(coords, This);
      }
    });
  }
  onMapClick() {
    if (!this.currentLocationIcon) {
      this.currentLocationIcon = new H.map.Icon("/assets/img/currentLocation.png");
    }
    if(this.parentComponent){
      switch(this.parentComponent.componentType){
        case "COMPANY":
          this.mapClickForCompany();
          break;
        case "CITIZEN":
          this.mapClickForCitizen();
          break;
        case "HOME":
          this.mapClickForHome();
          break;
        default:
          break;
      }
    }
  }

  displayUsersNearby(coords, This) {
    this.mapsService.getNearbyUsersByCoordinates(coords.lat, coords.lng, this.userService.localStorage.getItem("user")).subscribe(
      (resp: Array<any>) => {
        if (resp) {
          if (This.companyNearbyMarkers) {
            This.map.removeObjects(This.companyNearbyMarkers);
          }
          let nearbyPlaces = [];
          resp.forEach(nearbyUser => {
            let userInfo = {"id": nearbyUser.id, "title":"", "content":"", "icon":nearbyUser.role};
            switch(nearbyUser.role){
              case "COMPANY":
                userInfo.title=nearbyUser.companyName;
                userInfo.content=`<div><i class="fas fa-recycle"></i> ${nearbyUser.materialList ? nearbyUser.materialList.join(","): ""}</div><div>${nearbyUser.email} </div><div><i class="fas fa-phone-square-alt"></i> ${nearbyUser.companyPhoneNumber}</div><div><i class="fas fa-home"></i> ${nearbyUser.address}</div>`
                break;
              case "CITIZEN":
                userInfo.title=nearbyUser.name;
                userInfo.content=`<div><i class="fas fa-recycle"></i> ${nearbyUser.citizenRequestsMaterials ? nearbyUser.citizenRequestsMaterials.join(","): ""}</div>`;
                break;
              default:
                break;
            }
            nearbyPlaces.push({ "lat": nearbyUser.latitude, "lng": nearbyUser.longitude, "info": userInfo})
          });
          This.companyNearbyMarkers = This.displayPlaces(nearbyPlaces, This.currentLocation);
        }
      }
    )
  }

  displayCompaniesOnLandingPage(){
    this.companyService.getAllRecyclingStations().subscribe(
      (resp: Array<any>)=>{
        let nearbyPlaces = [];
          resp.forEach(nearbyCompany => {
            let companyInfo = {
              "title": nearbyCompany.companyName,
              "content": `<div><i class="fas fa-recycle"></i> ${nearbyCompany.materialList ? nearbyCompany.materialList.join(","): ""}</div><div>${nearbyCompany.email} </div><div><i class="fas fa-phone-square-alt"></i> ${nearbyCompany.companyPhoneNumber}</div><div><i class="fas fa-home"></i> ${nearbyCompany.address}</div>`,
              "id": nearbyCompany.id,
              "icon": "COMPANY"
            }
            nearbyPlaces.push({ "lat": nearbyCompany.latitude, "lng": nearbyCompany.longitude, "info": companyInfo })
          });
          //set center in fixed location - Piata Unirii
          let currentLocation={"lat": 47.165591, "lng":27.580830};
          this.displayPlaces(nearbyPlaces,currentLocation);
      }
    )
  }

  displayLocationsForCompany(places){
    if(this.companyNearbyMarkers){
      this.map.removeObjects(this.companyNearbyMarkers);
    }
    this.companyNearbyMarkers = this.displayPlaces(places, this.currentLocation);

  }
}
