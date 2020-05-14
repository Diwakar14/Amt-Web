import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments.service';
declare var Notiflix:any;
declare var $:any;

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {


  serviceCategory = {
    categories:[]
  };
  serviceList = [];
  service = {
    id: null,
    category: null,
    name: '',
    description: '',
    amount: null,
  }

  serviceDetails;

  constructor(private paymentService: PaymentsService) { }

  ngOnInit(): void {
    this.paymentService.getServiceCategory().subscribe((cat: any) => {
      this.serviceCategory = cat.categories;
    });
    this.paymentService.getService().subscribe(
      (res: any) => {
        this.serviceList = res.services;
      }
    )
  }

  createService(f: NgForm){
    console.log(this.service);
    this.paymentService.createService(this.service).subscribe(
      res => {
        Notiflix.Notify.Success('Service Created !');
        f.reset();
      },
      err => {
        Notiflix.Notify.Failure('Error in creating Service !');
      }
    )
  }
  showDetails(id){
    $("#SerDetails").modal('show');
    this.paymentService.getServiceDetail(id).subscribe(
      (res: any) => {
        this.serviceDetails = res.service;
        console.log(this.serviceDetails)
      }
    )
  }
  edit(service){
    $("#updateSer").modal('show');
    this.service.id = service.id;
    this.service.name = service.name;
    this.service.description = service.description;
    this.service.amount = service.amount;
    this.service.category = service.category;
  }

  updateService(f: NgForm){
    this.paymentService.updateService(this.service.id, this.service).subscribe(
      res => {
        Notiflix.Notify.Success('Service Updated !');
        $("#updateSer").modal('hide');
        f.reset();
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in updating Service !');
        $("#updateSer").modal('hide');
        f.reset();
      }
    )
  }
  delete(id){
    this.paymentService.deleteService(id).subscribe(
      res => {
        Notiflix.Notify.Success('Service Deleted Successfully !');
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in Deleteing Service !');
      }
    )
  }

}
