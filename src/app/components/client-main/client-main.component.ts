import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrls: ['./client-main.component.scss']
})
export class ClientMainComponent implements OnInit {

  @Input() chatData;
  userServiceData;

  constructor() { }

  ngOnInit(): void {
    
  }

  someSentData(data){
    this.userServiceData = data;
  }

}
