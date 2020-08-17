import { OperatorService } from './../../services/operator.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var Notiflix:any;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  password = {
    old_password:'',
    password:'',
    confirm_password:''
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private uiService: UIService,
    private operatorSer: OperatorService
  ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }

  ngOnInit(): void {
  }

  resetPassword(form){
    if(this.password.password == this.password.confirm_password){
      this.operatorSer.updateOperator(this.password, localStorage.getItem('_user_id')).subscribe((res: any) => {
        Notiflix.Notify.Success('Password Updated !');
      });
    }else{
      Notiflix.Notify.Success('Password and Confirm Password does not match.');
    }
  }

}
