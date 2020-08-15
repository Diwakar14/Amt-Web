import { switchMap } from 'rxjs/operators';
import { UIService } from 'src/app/services/ui.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-ticket-card',
  templateUrl: './client-ticket-card.component.html',
  styleUrls: ['./client-ticket-card.component.scss']
})
export class ClientTicketCardComponent implements OnInit {

  ongoing = 0;
  total = 0;
  closed = 0;
  userId: any;

  @Input() clientId;
  @Input() userServiceData;
 
  constructor(private userService: UserserviceService,
    private uiService: UIService
    ) { }

  ngOnInit(): void {
    this.getStats();
  }

  getStats(){
    if(this.userServiceData.success == 1){
      this.closed = 0;
      this.ongoing = 0;
      this.total = 0;
      this.userServiceData.tickets.data.map(item => {
        if(item.status == 'Ongoing') this.ongoing++;
        else if(item.status == 'Closed') this.closed++;
        this.total++;
      });
    }
  }
}
