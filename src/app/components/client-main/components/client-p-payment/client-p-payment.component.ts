import { UIService } from './../../../../services/ui.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-p-payment',
  templateUrl: './client-p-payment.component.html',
  styleUrls: ['./client-p-payment.component.scss']
})
export class ClientPPaymentComponent implements OnInit {


  pendingPayments = [];
  userId;
  constructor(private uiService:UIService, private paymentService: PaymentsService) { }

  ngOnInit(): void {
    this.uiService.currentApprovalStageMessage.subscribe(data => {
      let user = JSON.parse(data).users;
      for (let i = 0; i < user.length; i++) {
        if(user[i].windowState === true)
          this.userId = user[i].userId;
      }
      this.getPaymentList(this.userId);
    });
    this.uiService.currentApprovalStageRefreshMessage.subscribe(() => {
      this.getPaymentList(this.userId);
    })
  }


  getPaymentList(userid){
    this.paymentService.getPaymentList(userid).subscribe(
      (res:any) => {
        this.pendingPayments = res.payments;
        console.log(this.pendingPayments);
      }
    )
  }

}
