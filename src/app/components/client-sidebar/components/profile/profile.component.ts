import { Users } from './../../../../models/usersModel';
import { UIService, users } from './../../../../services/ui.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private uiService: UIService) { }

  loading = false;
  users = {
    name:''
  };

  ngOnInit(): void {
    this.uiService.currentApprovalStageMessage.subscribe(
      (res: any) => {
        console.log("Message from profile", JSON.parse(res));
        let data = JSON.parse(res);
        for (let i = 0; i < data.users.length; i++) { 
          if(data.users[i].windowState === true){
            this.users.name = data.users[i].name;
          }
        }
      },
      err => {
        console.log("Error Occured: ", err);
      }
    )
  }

}
