import { OperatorService } from './../../../../services/operator.service';
import { NgForm } from '@angular/forms';
import { UIService } from './../../../../services/ui.service';
import { PaymentsService } from './../../../../services/payments.service';
import { Component, OnInit } from '@angular/core';
import { UserserviceService } from 'src/app/services/userservice.service';
import { take } from 'rxjs/operators';
declare var $:any;
declare var Notiflix:any;

@Component({
  selector: 'app-client-ongtickets',
  templateUrl: './client-ongtickets.component.html',
  styleUrls: ['./client-ongtickets.component.scss']
})
export class ClientOngticketsComponent implements OnInit {

  paymentsList = {
    tickets:[] = []
  };
  service = {
    serviceId:'',
    assign:false,
    assignee: ''
  }
  
  
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

  submitPayment = false;
  submitTicket = false;
  operators: any = [];

  constructor(private paymentService: PaymentsService, 
    private userService: UserserviceService,
    private operatorSer: OperatorService,
    private uiService: UIService) {
      this.paymentService.getService('category').subscribe(
        (res:any) => {
          this.serviceList = res.categories;
          this.service.serviceId = this.serviceList[0].services[0].id;
        },
        err => {
          console.log(err)
        }
      );
      
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
          this.paymentsList.tickets = res.tickets;
          console.log(this.paymentsList)
        }
      );
      
    });
  }

  changeAssignee(){
    this.service.assign = !this.service.assign;
    this.operatorSer.AllOperator().subscribe((res: any) => {
      if (res.success == 1) {
        this.operators = res.users;
        this.service.assignee = res.users[0].id;
      }
    });
  }

  createTicket(f: NgForm){
    this.submitTicket = true;

    let formdata = new FormData();
    formdata.append('user', this.user.userId.toString());
    formdata.append('service',this.service.serviceId);
    if(this.service.assign){
      formdata.append('assignee',this.service.assignee);
    }
    this.userService.createUserService(formdata).subscribe(
      res => {
        Notiflix.Notify.Success("New Ticket Created !");
        f.reset();
        this.submitTicket = false;
        $("#createTicket").modal('hide');
        this.ngOnInit();
        this.uiService.updateApprovalRefreshMessage(true);
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.submitTicket = false;

      }
    )
  }


  showPaymentDialog(payment){
    $('#createPayment').modal('show');
    this.createPayementObj.amount = payment.amount;
    this.createPayementObj.service_availed = payment.service.name;
    this.createPayementObj.due_date = payment.end_date;
    this.createPayementObj.user_id = this.user.userId;
    this.createPayementObj.user_service_id = payment.id;
}

  generatePayment(){
    console.log(this.createPayementObj);
    this.submitPayment = true;
    let paymentObj = {
      user: this.createPayementObj.user_id, 
      ticket: this.createPayementObj.user_service_id, 
      amount: this.createPayementObj.amount
    }
    this.paymentService.createPayment(paymentObj)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          Notiflix.Notify.Success(res.message);
          $("#createPayment").modal('hide');
          this.submitPayment = false;
          this.uiService.updateApprovalRefreshMessage(true);
        },
        err => {
          Notiflix.Notify.Failure(err.error.message);
          this.submitPayment = false;
        }
      )
  }

}
