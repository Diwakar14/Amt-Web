import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var Notiflix: any;
@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  form: FormGroup;
  submit = false;

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
     private uiService: UIService) {

    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  get f() { return this.form.controls; }

  onSubmit(){
    this.submit = true;
    this.userService.createClient(this.form.value).subscribe((res: any) => {
      if(res.success == 1){
        this.submit = false;
        Notiflix.Notify.Success(res.message);
        this.form.reset();
      }
    },
    err => {
      Notiflix.Notify.Failure(err.error.message);
      this.submit = false;
    });
  }
}
