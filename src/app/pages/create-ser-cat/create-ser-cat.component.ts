import { NgForm } from '@angular/forms';
import { PaymentsService } from './../../services/payments.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var $:any;
declare var Notiflix:any;

@Component({
  selector: 'app-create-ser-cat',
  templateUrl: './create-ser-cat.component.html',
  styleUrls: ['./create-ser-cat.component.scss']
})
export class CreateSerCatComponent implements OnInit {

  loader = false;
  submit = false;

  serviceCategory = {
    id: 0,
    name: '',
    description: ''
  }

  allServiceCat = [];
  constructor(private paymentService: PaymentsService,
    
    private activatedRoute: ActivatedRoute,
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
    $(document).ready(function() {
      $('.service-list').select2();
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

  }

  createCategory(f: NgForm){
    this.submit = true;
    this.paymentService.createServiceCategory(this.serviceCategory).subscribe(
      res => {
        Notiflix.Notify.Success('Service Category Created !');
        f.reset();
        this.submit = false;
        $("#createSerCat").modal('hide');
        this.ngOnInit();
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
    this.serviceCategory.description = cat.description;
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
  delete(id, i){
    this.delLoading(i);
    this.paymentService.deleteServiceCategory(id).subscribe(
      res => {
        Notiflix.Notify.Success('Service Category Deleted !');
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in deleting Service Category !');
      }
    )
  }
  delLoading(i){
    document.querySelector('#del_cat_' + i).setAttribute('style', 'display:none');
    document.querySelector('#del_cat_load_' + i).setAttribute('style', 'display:initial;filter:invert(1)');
  }
}
