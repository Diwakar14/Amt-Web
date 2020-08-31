import { NgForm } from '@angular/forms';
import { OperatorService } from './../../services/operator.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix:any;
declare var $:any;

@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss']
})
export class OperatorListComponent implements OnInit {

  loader = false;
  operators = [];
  operatorModel = {
    id:'',
    name:'',
    email:'',
    password:'',
    phone:'',
    role:''
  };
  disabledOperator = false;
  constructor( private activatedRoute: ActivatedRoute,
    private operator:OperatorService,
    private uiService: UIService) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }

  ngOnInit(): void {
    this.loader = true;
    this.operator.AllOperator().subscribe((res: any) => {
      if(res.success == 1){
        this.operators = res.users;
        this.loader = false;
        console.log(this.operators)
      }
    },err => {
      console.log(err.error);
      this.loader = false;

    })
  }

  showEdit(operator){
    $('#update_operator').modal('show')
    this.operatorModel = operator;
    this.operatorModel.role = operator.roles[0].role;
    console.log(this.operatorModel);
  }

  update_operator(form: NgForm){
    this.disabledOperator = true;
    this.operator.updateOperator(form.value, this.operatorModel.id).subscribe((res: any) => {
      if(res.success){
        Notiflix.Notify.Success('Operator Updated !!!');
        this.disabledOperator = false;
        $('#update_operator').modal('hide')
      }
    }, err => {
      Notiflix.Notify.Failure(err.error.message);
      this.disabledOperator = false;

    })
  }
}
