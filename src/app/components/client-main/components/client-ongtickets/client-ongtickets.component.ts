import { NoteService } from './../../../../services/note.service';
import { HttpParams } from '@angular/common/http';
import { OperatorService } from './../../../../services/operator.service';
import { NgForm } from '@angular/forms';
import { UIService } from './../../../../services/ui.service';
import { PaymentsService } from './../../../../services/payments.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserserviceService } from 'src/app/services/userservice.service';
import { take, switchMap, delay } from 'rxjs/operators';
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

  notesModel = {
    note:'',
    ticket:''
  }
  notes = [];

  serviceList = [];
  createPayementObj = {
    user_id: null,
    user_service_id: null,
    amount: "",
    service_availed: '',
    customer_name: '',
  }
  statuses = ['Created','Ongoing','In Review','Pending','Cancelled','Completed'];
  ticketStatuses = [];

  submitPayment = false;
  paymentStatus;
  paymentStatusList = [];
  submitTicket = false;
  operators: any = [];
  loader = false;
  
  tab = 'note'
  disableNote = false;
  disableStatus = false;

  @Input() client;
  @Input() userServiceData;
  @Output() change = new EventEmitter();

  constructor(private paymentService: PaymentsService, 
    private userService: UserserviceService,
    private operatorSer: OperatorService,
    private noteService: NoteService,
    private uiService: UIService) {
      
    }
  ngOnInit(): void {
    this.loader = true;
    this.user.name = this.client.name;

    this.userService.getUserService(this.client.clientId)
    .pipe(delay(600))
    .subscribe((res: any) => {
      if(res.success == 1){
        this.paymentsList.tickets = res.tickets.data;
      }
      this.change.emit(res);
    })
    this.paymentService.getService('category').subscribe(
      (res: any) => {
        this.serviceList = res.categories;
        this.service.serviceId = this.serviceList[0].services[0].id;
      },
      err => {
        console.log(err);
      }
    );    
  }

  getNotes(){
    this.noteService.getNotes(this.createPayementObj.user_service_id).subscribe((res: any) => {
      if(res.success){
        this.notes = res.notes;
      }
    });
  }

  addNotes(){
    this.disableNote = true
    this.notesModel.ticket = this.createPayementObj.user_service_id;
    this.noteService.addNotes(this.notesModel).subscribe((res: any) => {
      if(res.success){
        // console.log(res);
        this.notes.unshift(res.note);
        this.notesModel.note = '';
        this.disableNote = false;

      }
    },err => {
      console.log(err);
      this.disableNote = false;
    });
  }

  showTicketInfo(payment){
    $("#ticketDetails_" + this.client.clientId).modal('show');
    this.notesModel.note = '';
    this.createPayementObj.service_availed = payment.service.name;
    this.createPayementObj.user_id = this.client.clientId;
    this.paymentStatus = payment.status;
    this.createPayementObj.user_service_id = payment.id;
    this.getNotes();
    this.getTicketStatus();
    this.getPaymentForTicket();
  }

  getPaymentForTicket(){
    this.paymentService.getPaymentTicket(this.createPayementObj.user_service_id).subscribe((res: any) => {
      if(res.success){
        this.paymentStatusList = res.payments;
      }
    })
  }
  getTicketStatus(){
    this.userService.getUserServiceStatus(this.createPayementObj.user_service_id).subscribe((res: any) => {
      if(res.success){
        this.ticketStatuses = res.statuses;
      }
    })
  }

  updateTicketStatus(){
    this.disableStatus = true;
    let status = {
      status: this.paymentStatus
    }
    this.userService.updateUserService(this.createPayementObj.user_service_id, status).subscribe((res: any) => {
      if(res.success){
        this.ticketStatuses.unshift(res.status);
        this.disableStatus = false;
      }
    }, err => {
      this.disableStatus = false;
    })
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

  showTicketDialog(){
      $("#createTicket_" + this.client.clientId).modal('show');
  }

  createTicket(f: NgForm){
    this.submitTicket = true;
    let formdata = new FormData();
    formdata.append('user', this.client.clientId);
    formdata.append('service',this.service.serviceId);
    if(this.service.assign){
      formdata.append('assignee',this.service.assignee);
    }
    this.userService.createUserService(formdata).pipe(take(1)).subscribe(
      res => {
        Notiflix.Notify.Success("New Ticket Created !");
        f.reset();
        this.submitTicket = false;
        $("#createTicket_" + this.client.clientId).modal('hide');
        this.ngOnInit();
        this.uiService.updateApprovalRefreshMessage(true);
      },
      err => {
        Notiflix.Notify.Failure(err.error.message);
        this.submitTicket = false;

      }
    )
  }


  generatePayment(){
    this.submitPayment = true;
    if(this.createPayementObj.amount == undefined || this.createPayementObj.amount == ""){
      Notiflix.Notify.Failure("Enter some amount");
    }else{
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
            this.paymentStatusList.unshift(res.payment);
            $("#createPayment_" + this.client.clientId).modal('hide');
            this.submitPayment = false;
            this.createPayementObj.amount = "";
            this.uiService.updateApprovalRefreshMessage(true);
          },
          err => {
            Notiflix.Notify.Failure(err.error.message);
            this.submitPayment = false;
          }
        )
    }
    
  }
  reload(){
    this.ngOnInit();
  }
}
