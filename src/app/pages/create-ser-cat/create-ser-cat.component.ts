import { CookieService } from 'ngx-cookie-service';
import { fadeAnimation } from './../../animation';
import { NgForm } from '@angular/forms';
import { PaymentsService } from './../../services/payments.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';

import * as jwt_decode from 'jwt-decode';

declare var $:any;
declare var Notiflix:any;

@Component({
  selector: 'app-create-ser-cat',
  templateUrl: './create-ser-cat.component.html',
  styleUrls: ['./create-ser-cat.component.scss'],
  animations:[ fadeAnimation ]
})
export class CreateSerCatComponent implements OnInit {

  loader = false;
  submit = false;
  deleteDisabled = false;

  serviceCategory = {
    id: 0,
    name: '',
  }
  @ViewChild('icon') icon:ElementRef;

  allServiceCat = [];
  role: any;
  index: any;
  constructor(
    private paymentService: PaymentsService,
    private activatedRoute: ActivatedRoute,
    private cookie: CookieService,
    private uiService: UIService
    ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
    
  }

  ngOnInit(): void {
    $.uploadPreview({
      input_field: "#icons",   // Default: .image-upload
      preview_box: "#image-preview",  // Default: .image-preview
      label_field: "#image-label",    // Default: .image-label
      label_default: "Choose File",   // Default: Choose File
      label_selected: "Change File",  // Default: Change File
      no_label: false                 // Default: false
    });
    this.loader = true;
    this.paymentService.getServiceCategory().subscribe(
      (res:any) => {
        this.allServiceCat = res.categories;
        this.loader = false;
      },
      err => {
        this.loader = false;
      }
    )
    this.role = jwt_decode(this.cookie.get('auth_token')).allowed[0];
  }

  createCategory(f: NgForm){
    this.submit = true;
    let formdata = new FormData();
    formdata.append('name', this.serviceCategory.name);
    formdata.append('icon', this.icon.nativeElement.files[0]);

    this.paymentService.createServiceCategory(formdata).subscribe(
      (res: any) => {
        Notiflix.Notify.Success('Service Category Created !');
        f.reset();
        this.submit = false;
        
        $("#createSerCat").modal('hide');
        this.allServiceCat.unshift(res.category);
      },
      err => {
        Notiflix.Notify.Failure('Error in creating Service Category !');
        this.submit = false;
      }
    )
  }

  edit(cat){
    $("#updateSerCat").modal('show');
    this.serviceCategory.id = cat.id;
    this.serviceCategory.name = cat.name;
  }

  updateServiceCategory(f: NgForm){
    this.submit = true;
    this.paymentService.updateServiceCategory(this.serviceCategory.id, this.serviceCategory).subscribe(
      res => {
        Notiflix.Notify.Success('Service Category Updated !');
        $("#updateSerCat").modal('hide');
        this.submit = false;
        f.reset();
      },
      err => {
        Notiflix.Notify.Failure('Error in updating Service Category !');
        this.submit = false;
      }
    )
  }

  confirmDelete(id, i){
    $("#confirmDeleteCategory").modal('show');
    this.serviceCategory.id = id;
    this.index = i;
  }

  delete(){
    this.deleteDisabled = true;
    this.paymentService.deleteServiceCategory(this.serviceCategory.id).subscribe(
      res => {
        Notiflix.Notify.Success('Service Category Deleted !');
        $("#confirmDeleteCategory").modal('hide');
        this.serviceCategory.id = 0;
        this.allServiceCat.splice(this.index, 1);
        this.deleteDisabled = false;

      },
      err => {
        Notiflix.Notify.Failure('Error in deleting Service Category !');
        this.deleteDisabled = false;
      }
    )
  }
  

  delLoading(i){
    document.querySelector('#del_cat_' + i).setAttribute('style', 'display:none');
    document.querySelector('#del_cat_load_' + i).setAttribute('style', 'display:initial;');
  }
}
