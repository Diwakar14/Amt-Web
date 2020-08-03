import { UIService } from './../../services/ui.service';
import { UserserviceService } from './../../services/userservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ongoing-ticket',
  templateUrl: './ongoing-ticket.component.html',
  styleUrls: ['./ongoing-ticket.component.scss']
})
export class OngoingTicketComponent implements OnInit {

  constructor(private userSerice: UserserviceService, private uiService: UIService) { }

  ongoingService = [];

  ngOnInit(): void {
    
    
  }

}
