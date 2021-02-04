
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
declare var H: any;
@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit, AfterViewInit {

  constructor() { }
  componentType="HOME";
  @ViewChild('landingPageMap', { static: false })
  landingPageMap: any;
  
  ngOnInit() {
  }

  ngAfterViewInit(){
    this.landingPageMap.displayCompaniesOnLandingPage();
  }

}
