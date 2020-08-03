import { OperatorService } from './../../services/operator.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss']
})
export class OperatorListComponent implements OnInit {

  loader = false;
  operators = [];
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

      }
    },err => {
      console.log(err.error);
      this.loader = false;

    })
  }

}
