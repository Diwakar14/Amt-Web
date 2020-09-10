import { fadeAnimation } from './../../animation';
import { NgForm } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments.service';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
import * as jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

declare var Notiflix:any;
declare var Tagify:any;
declare var $:any;

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
  animations: [ fadeAnimation]
})
export class CreateServiceComponent implements OnInit, AfterViewInit {


  serviceCategory = {
    categories:[] = []
  };
  serviceList = [];
  service = {
    id: null,
    category: null,
    name: '',
    documents: [],
    eta:'',
    description: '',
    amount: null,
  }

  tagify;
  serviceDetails;
  loader = false;
  loadingDetails = false;
  submit = false;
  del = false;
  update_tagify: any;
  role: any;
  index: any;

  constructor(
    private paymentService: PaymentsService,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private uiService: UIService
    ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }
  ngAfterViewInit(): void {
    this.tagify = new Tagify(document.querySelector('textarea[name=document]'));
    this.update_tagify = new Tagify(document.querySelector('textarea[name=document_update]'));
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
    this.role = jwt_decode(this.cookie.get('auth_token')).allowed[0];

  }

  createServiceModal(){
    this.service.amount = '';
    this.service.category = 1;
    this.service.description = '';
    this.service.id = '';
    this.service.eta = '';
    this.service.name = '';

    $("#createSer").modal('show');
  }

  createService(f: NgForm){
    this.submit = true;
    if(this.tagify.value.length > 0){
      this.service.documents = [...this.tagify.value.map(item => item.value)];
    }
    this.paymentService.createService(this.service).subscribe(
      (res: any) => {
        Notiflix.Notify.Success('Service Created !');
        $("#createSer").modal('hide');
        this.ngOnInit();
        // this.serviceList.unshift(res.service);
        f.reset();
        this.tagify.removeAllTags();
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
    this.update_tagify.removeAllTags();
    this.paymentService.getServiceDetail(service.id).subscribe((res: any) => {
      if(res.success){
        this.service.id = res.service.id;
        this.service.name = res.service.name;
        this.service.description = res.service.description;
        this.service.amount = res.service.amount;
        this.service.category = res.service.category_id;
        this.service.eta = res.service.eta;
        if(res.service.documents)
          this.update_tagify.addTags(res.service.documents);
      }
    })
    
  }

  updateService(f: NgForm){
    this.submit = true;
    if(this.update_tagify.value.length > 0){
      this.service.documents = [...this.update_tagify.value.map(item => item.value)];
    }
    this.paymentService.updateService(this.service.id, this.service).subscribe(
      res => {
        Notiflix.Notify.Success('Service Updated !');
        $("#updateSer").modal('hide');
        this.submit = false;
        f.reset();
        this.update_tagify.removeAllTags();
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in updating Service !');
        this.submit = false;
      }
    )
  }
  confirmDelete(id, i){
    $("#confirmDeleteService").modal('show');
    this.service.id = id;
    this.index = i;
  }

  delete(){
    this.del = true;
    this.paymentService.deleteService(this.service.id).subscribe(
      res => {
        Notiflix.Notify.Success('Service Deleted Successfully !');
        $("#confirmDeleteService").modal('hide');
        this.del = false;
        this.service.id = null;
        this.serviceList.splice(this.index, 1);
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
