import { Users } from './../../../../models/usersModel';
import { UIService } from './../../../../services/ui.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input() profileData;
  constructor(private uiService: UIService) { }

  loading = false;
  users = {
    name:'',
    email:'',
    phone:''
  };

  ngOnInit(): void {
    this.users.email = this.profileData.email;
    this.users.phone = this.profileData.phone;
    this.users.name = this.profileData.name;
  }

}
