import { NgForm } from '@angular/forms';
import { UIService } from './../../../../services/ui.service';
import { PaymentsService } from './../../../../services/payments.service';
import { Component, OnInit } from '@angular/core';
import { UserserviceService } from 'src/app/services/userservice.service';
declare var $:any;
declare var Notiflix:any;

@Component({
  selector: 'app-client-ongtickets',
  templateUrl: './client-ongtickets.component.html',
  styleUrls: ['./client-ongtickets.component.scss']
})
export class ClientOngticketsComponent implements OnInit {

  paymentsList = {
    tickets:[]
  };
  serviceId
  
  user = {
    userId:0,
    name:''
  };
  serviceList = [];
  createPayementObj = {
    user_id: null,
    user_service_id: null,
    amount: 0,
    service_availed: '',
    customer_name: '',
    due_date: ''
  }
  constructor(private paymentService: PaymentsService, 
    private userService: UserserviceService,
    private uiService: UIService) {
      this.paymentService.getService().subscribe(
        (res:any) => {
          this.serviceList = res.services
        },
        err => {
  
        }
      )
    }

  ngOnInit(): void {
    this.uiService.currentApprovalStageMessage.subscribe(data => {
      let user = JSON.parse(data).users;

      for (let i = 0; i < user.length; i++) {
        if(user[i].windowState === true){
          this.user.userId = user[i].userId;
          this.user.name = user[i].name;
        }
      }
      this.userService.getUserService(this.user.userId).subscribe(
        (res: any) => {
          for (let i = 0; i < res.length; i++) {
            if(res[i].statuses[0].status === 'Ongoing')
              this.paymentsList.tickets.push(res[i]);
          }
        }
      );
      
    });
  }

  createTicket(f: NgForm){
    this.userService.createUserService(this.user.userId, this.serviceId).subscribe(
      res => {
        Notiflix.Notify.Success("New Ticket Created !");
        f.reset();
        $("#createTicket").modal('hide');
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
      }
    )
  }


  showPaymentDialog(payment){
    $('#createPayment').modal('show');
    this.createPayementObj.amount = payment.amount;
    this.createPayementObj.service_availed = payment.service_name;
    this.createPayementObj.due_date = payment.start_date_formatted;
    this.createPayementObj.user_id = this.user.userId;
    this.createPayementObj.user_service_id = payment.service_id;
}

  generatePayment(){
    console.log(this.createPayementObj);
    this.paymentService.createPayment(this.createPayementObj.user_id, 
      this.createPayementObj.user_service_id, this.createPayementObj.amount)
      .subscribe(
        (res: any) => {
          Notiflix.Notify.Success(res.message);
          $("#createPayment").modal('hide');
        },
        err => {
          Notiflix.Notify.Failure(err.error.message);
        }
      )
  }

}
