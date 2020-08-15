import { UIService } from './../../services/ui.service';
import { UserserviceService } from './../../services/userservice.service';
import { Component, OnInit, Input } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-ongoing-ticket',
  templateUrl: './ongoing-ticket.component.html',
  styleUrls: ['./ongoing-ticket.component.scss']
})
export class OngoingTicketComponent implements OnInit {

  @Input() data;
  constructor(private userSerice: UserserviceService, private uiService: UIService) { }
  
  
  ongoingService = [];

  ngOnInit(): void {
    if(this.data)
      this.ongoingService = this.data.tickets_ongoing;
  }



}
