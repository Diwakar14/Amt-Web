import { NgForm } from '@angular/forms';
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
    new_password:'',
    confirm_password:''
  }
  disable = false;
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

  resetPassword(form:NgForm){
    this.disable = true;
    let password = {
      new_password: this.password.new_password,
      old_password: this.password.old_password
    }
    if(this.password.new_password == this.password.confirm_password){
      this.operatorSer.changePassword(password).subscribe((res: any) => {
        Notiflix.Notify.Success('Password Updated !');
        this.disable = false;
        form.reset(this.password);
      }, err => {
        Notiflix.Notify.Failure(err.error.message);
        this.disable = false;
      });
    }else{
      Notiflix.Notify.Failure('Password and Confirm Password does not match.');
    }
  }

}
