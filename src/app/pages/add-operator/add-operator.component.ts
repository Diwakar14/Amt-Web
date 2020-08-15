import { NgForm } from '@angular/forms';
import { OperatorService } from './../../services/operator.service';
import { Operator } from './../../models/operatorModel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix:any;
@Component({
  selector: 'app-add-operator',
  templateUrl: './add-operator.component.html',
  styleUrls: ['./add-operator.component.scss']
})
export class AddOperatorComponent implements OnInit {

  submit = false;
  operatorId;

  operator:Operator = new Operator();
  constructor(
      private operatorService: OperatorService,
      private activatedRoute: ActivatedRoute,
      private uiService: UIService
    ) {
      
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }

  ngOnInit(): void {
  }
  createOperator(f:NgForm){
    this.submit = true;
    this.operatorService.createOperator(this.operator).subscribe(
      res => {
        Notiflix.Notify.Success('New Operator Created !!!');
        this.submit = false;
        f.reset(new Operator);
      },
      err => {
        console.log(err);
        this.submit = false;
      }
    );
  }

}
