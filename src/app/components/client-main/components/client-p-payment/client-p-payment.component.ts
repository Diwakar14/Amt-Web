import { UIService } from './../../../../services/ui.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-p-payment',
  templateUrl: './client-p-payment.component.html',
  styleUrls: ['./client-p-payment.component.scss']
})
export class ClientPPaymentComponent implements OnInit {


  pendingPayments = [];
  userId;
  @Input() clientId;

  constructor(private uiService:UIService, private paymentService: PaymentsService) { }

  ngOnInit(): void {
    this.getPaymentList(this.clientId);
  }


  getPaymentList(userid){
    this.paymentService.getPaymentList(userid).subscribe(
      (res:any) => {
        this.pendingPayments = res.payments;
      }
    )
  }

  reload(){
    this.ngOnInit();
  }

}
