import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'validation-message',
  templateUrl: './validation-error-message.component.html',
  styleUrls: ['./validation-error-message.component.css']
})
export class ValidationErrorMessageComponent implements OnInit {

  @Input()
  validationErrors : any;

  @Input()
  inputName : string;

  constructor() { }

  ngOnInit() {
  }

  displayError(){
    if(this.validationErrors){
      return this.validationErrors[this.inputName];
    }
    return false;
  }

}
