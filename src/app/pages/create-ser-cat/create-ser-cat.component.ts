import { NgForm } from '@angular/forms';
import { PaymentsService } from './../../services/payments.service';
import { Component, OnInit } from '@angular/core';
declare var $:any;
declare var Notiflix:any;

@Component({
  selector: 'app-create-ser-cat',
  templateUrl: './create-ser-cat.component.html',
  styleUrls: ['./create-ser-cat.component.scss']
})
export class CreateSerCatComponent implements OnInit {


  serviceCategory = {
    id: 0,
    name: '',
    description: ''
  }

  allServiceCat = [];
  constructor(private paymentService: PaymentsService) { }

  ngOnInit(): void {
    $(document).ready(function() {
      $('.service-list').select2();
    });
    this.paymentService.getServiceCategory().subscribe(
      (res:any) => {
        this.allServiceCat = res.categories
      },
      err => {
        
      }
    )

  }

  createCategory(f: NgForm){
    console.log(this.serviceCategory);
    this.paymentService.createServiceCategory(this.serviceCategory).subscribe(
      res => {
        Notiflix.Notify.Success('Service Category Created !');
        f.reset();
        $("#createSerCat").modal('hide');
        this.ngOnInit();
      },
      err => {
        Notiflix.Notify.Failure('Error in creating Service Category !');
        f.reset();
        $("#createSerCat").modal('hide');
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
    console.log(this.serviceCategory);
    
    this.paymentService.updateServiceCategory(this.serviceCategory.id, this.serviceCategory).subscribe(
      res => {
        Notiflix.Notify.Success('Service Category Updated !');
        $("#updateSerCat").modal('hide');
        f.reset();
      },
      err => {
        Notiflix.Notify.Failure('Error in updating Service Category !');
        $("#updateSerCat").modal('hide');
        f.reset();
      }
    )
  }
  delete(id){
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

}
