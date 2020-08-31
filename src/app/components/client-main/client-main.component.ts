import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrls: ['./client-main.component.scss']
})
export class ClientMainComponent implements OnInit {

  @Input() chatData;
  userServiceData;
  @Output() change = new EventEmitter();

  reload

  mainTab = 'tickets'

  constructor() { }

  ngOnInit(): void {
    
  }

  getUserServiceData(data){
    this.userServiceData = data;
    this.change.emit(this.userServiceData);
  }

}
