import { UIService } from './../../services/ui.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ongoing-ticket',
  templateUrl: './ongoing-ticket.component.html',
  styleUrls: ['./ongoing-ticket.component.scss']
})
export class OngoingTicketComponent implements OnInit {

  @Input() data;
  ongoingService = [];

  constructor() { }
  
  ngOnInit(): void {
    if(this.data)
      this.ongoingService = this.data.tickets_ongoing;

  }



}
