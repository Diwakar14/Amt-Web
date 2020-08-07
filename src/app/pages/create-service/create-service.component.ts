import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments.service';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix:any;
declare var $:any;

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {


  serviceCategory = {
    categories:[] = []
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
  loader = false;
  loadingDetails = false;
  submit = false;
  del = false;

  constructor(private paymentService: PaymentsService,
    
    private activatedRoute: ActivatedRoute,
    private uiService: UIService
  
    ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }

  ngOnInit(): void {
    this.loader = true;
    this.paymentService.getServiceCategory().subscribe((cat: any) => {
      this.serviceCategory.categories = cat.categories;
    });
    this.paymentService.getService().subscribe(
      (res: any) => {
        this.serviceList = res.services;
        this.loader = false;
      },
      err => {
        this.loader = false;
        console.log(err);
      }
    )
  }

  createServiceModal(){
    this.service.amount = '';
    this.service.category = 1;
    this.service.description = '';
    this.service.id = '';
    this.service.name = '';
    $("#createSer").modal('show');
  }

  createService(f: NgForm){
    this.submit = true;
    this.paymentService.createService(this.service).subscribe(
      res => {
        Notiflix.Notify.Success('Service Created !');
        $("#createSer").modal('hide');
        this.ngOnInit();
        f.reset();
        this.submit = false;
      },
      err => {
        Notiflix.Notify.Failure('Error in creating Service !');
        this.submit = false;
      }
    )
  }
  showDetails(id){
    $("#SerDetails").modal('show');
    this.loadingDetails = true;
    this.paymentService.getServiceDetail(id).subscribe(
      (res: any) => {
        this.serviceDetails = res.service;
        this.loadingDetails = false;
      },
      err => {
        this.loadingDetails = false;
      }
    )
  }
  edit(service){
    $("#updateSer").modal('show');
    this.service.id = service.id;
    this.service.name = service.name;
    this.service.description = service.description;
    this.service.amount = service.amount;
    this.service.category = service.service_category_id;
  }

  updateService(f: NgForm){
    this.submit = true;
    this.paymentService.updateService(this.service.id, this.service).subscribe(
      res => {
        Notiflix.Notify.Success('Service Updated !');
        $("#updateSer").modal('hide');
        this.submit = false;
        f.reset();
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in updating Service !');
        this.submit = false;
      }
    )
  }
  delete(id, i){
    this.del = true;
    this.delLoading(i);
    this.paymentService.deleteService(id).subscribe(
      res => {
        Notiflix.Notify.Success('Service Deleted Successfully !');
        this.del = false;
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in Deleteing Service !');
        this.del = false;
      }
    )
  }

  delLoading(i){
    document.querySelector('#del_' + i).setAttribute('style', 'display:none');
    document.querySelector('#del_load_' + i).setAttribute('style', 'display:initial;filter:invert(1)');
  }

}
