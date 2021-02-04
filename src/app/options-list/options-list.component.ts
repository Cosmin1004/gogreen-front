import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.css']
})
export class OptionsListComponent implements OnInit {
  @Input()
  options: any;

  @Output() onOptionChange : EventEmitter<string> = new EventEmitter();

  @Input()
  defaultValue:any;
  
  selectedValue: any;

  constructor() { }

  ngOnInit() {
  }

  selectedValueChanged(value){
   this.selectedValue=value;
   if(this.defaultValue==value){
    this.onOptionChange.emit(null);
   }else{
   this.onOptionChange.emit(this.selectedValue);
   }
  }

}
