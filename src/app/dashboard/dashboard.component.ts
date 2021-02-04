import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input()
  userActions =[];

  constructor(private modalService: NgbModal, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  logout(){
    this.modalService.dismissAll();
    this.userService.removeUser();
    this.router.navigate(['/']);
  }
  open(content) {
    this.modalService.open(content);
  }

  callUserAction(i){
    this.userActions[i].action();
  }

}
