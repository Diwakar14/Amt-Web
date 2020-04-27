import { NgForm } from '@angular/forms';
import { OperatorService } from './../../services/operator.service';
import { Operator } from './../../models/operatorModel';
import { Component, OnInit } from '@angular/core';
declare var Notiflix:any;
@Component({
  selector: 'app-add-operator',
  templateUrl: './add-operator.component.html',
  styleUrls: ['./add-operator.component.scss']
})
export class AddOperatorComponent implements OnInit {


  operator:Operator = new Operator();
  constructor(private operatorService: OperatorService) { }

  ngOnInit(): void {
  }
  createOperator(f:NgForm){
    console.log(this.operator);
    
    this.operatorService.createOperator(this.operator).subscribe(
      res => {
        Notiflix.Notify.Success('New Operator Created !!!');
        f.reset();
      },
      err => console.log(err)

    )
  }

}
