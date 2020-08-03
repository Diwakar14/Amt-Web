import { UIService } from 'src/app/services/ui.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(private userService: UserserviceService,
    private uiService: UIService
    ) { }

  ngOnInit(): void {
    this.uiService.currentApprovalStageRefreshMessage.subscribe(() => {
      this.getStats();
    })

    this.getStats();
  }

  getStats(){
    this.uiService.currentApprovalStageMessage.subscribe(data => {
      let user = JSON.parse(data).users;
      for (let i = 0; i < user.length; i++) {
        if(user[i].windowState === true)
          this.userId = user[i].userId;
      }

      this.userService.getUserService(this.userId).subscribe((res: any) => {
        if(res.success == 1){
          this.closed = 0;
          this.ongoing = 0;
          this.total = 0;
          res.tickets.map(item => {
            if(item.status == 'Ongoing') this.ongoing++;
            else if(item.status == 'Closed') this.closed++;
            this.total++;
          });
        }
      });
      
    });
  }

}
