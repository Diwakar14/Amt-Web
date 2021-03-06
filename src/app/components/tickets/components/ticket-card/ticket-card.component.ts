import { UIService } from './../../../../services/ui.service';
import { UserserviceService } from './../../../../services/userservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss']
})
export class TicketCardComponent implements OnInit {

  constructor(private userService: UserserviceService, private uiService: UIService) { }

  total;
  ongoing;
  closed;
  ngOnInit(): void {
    
  }

}
