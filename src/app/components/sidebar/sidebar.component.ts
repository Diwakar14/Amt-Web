import { UserService } from './../../services/user.service';
import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isExpanded = false;
  onlineUsers = [];
  userOnlinelist = [];
  expanded = true;
  usersList;
  constructor(private uiService: UIService, private userService: UserService) {
    this.uiService.currentApprovalStageMessage.subscribe(
      (res:any) => {
        this.usersList = res;
        this.expanded = res
      }
    )
  }
  
  ngOnInit(): void {
    this.userService.getOnlineUsers().subscribe(
      (res:any) => {
        this.onlineUsers = res.users
      },
      err => {
        console.log('Error ', err);
      }
    )
  }

  userDetails(user){
    let userObj = {
      userId:''+user.id+'',
      windowState: true,
      name:''+user.name+''
    }
    this.userOnlinelist.forEach(ele => {
      ele.windowState = false
    });
    let parsedList = JSON.parse(this.usersList);
    let id = parsedList.users.find(m => m.userId === userObj.userId);
    
    if(!id){
      this.userOnlinelist.push(userObj);
      this.uiService.updateApprovalMessage({
        users: this.userOnlinelist
      });
    }
  }


  expand(){
    this.isExpanded = !this.isExpanded;
  }

}
