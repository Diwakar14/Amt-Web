import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minimizedchatbox',
  templateUrl: './minimizedchatbox.component.html',
  styleUrls: ['./minimizedchatbox.component.scss']
})
export class MinimizedchatboxComponent implements OnInit {

  minimizedChats = [];
  chats = []
  stateUI;
  constructor(private state: UIService) { }

  ngOnInit(): void {
    
    this.state.currentApprovalStageMessage.subscribe(
      res => {
        let userlist = JSON.parse(res).users;
        this.minimizedChats = userlist;
      }
    )
  }

  openDialog(chat){
    let chatObj = {
      userId: ''+chat.userId+'',
      windowState: true,
      name: ''+chat.name+''
    }
    this.minimizedChats.forEach(ele => {
      ele.windowState = false
    });
    let chatUser = this.minimizedChats.findIndex(m => parseInt(m.userId) === parseInt(chatObj.userId));
    this.minimizedChats[chatUser] = chatObj;
    this.state.updateApprovalMessage(
      {
        users: this.minimizedChats
      }
    )   
  }

}
