import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-sidebar',
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.scss']
})
export class ClientSidebarComponent implements OnInit {

  @Input() chatData;
  @Input() userServiceData;
  constructor() {
    console.log(this.userServiceData)
  }

  ngOnInit(): void {

  }

}
