import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrls: ['./client-main.component.scss']
})
export class ClientMainComponent implements OnInit {

  @Input() chatData;
  userServiceData;
  reload

  constructor() { }

  ngOnInit(): void {
    
  }

  getUserServiceData(data){
    this.userServiceData = data;
  }

}
