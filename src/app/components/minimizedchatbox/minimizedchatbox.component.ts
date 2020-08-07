import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minimizedchatbox',
  templateUrl: './minimizedchatbox.component.html',
  styleUrls: ['./minimizedchatbox.component.scss']
})
export class MinimizedchatboxComponent implements OnInit {

  minimizedChats:any[] = [];
  chats = []
  stateUI;
  constructor(private state: UIService) { }

  ngOnInit(): void {
    this.state.currentChatboxState.subscribe(
      res => {
        let userlist = JSON.parse(res).onlineChats;
        this.minimizedChats = userlist;
        
        for (let i = 0; i < this.minimizedChats.length; i++) {
          if((this.minimizedChats.length > 1) && (i < (this.minimizedChats.length - 1))){
            this.minimizedChats[i].windowState = 'minimized';
          }
        }
        console.log("Before Update: ", this.minimizedChats)
      }
    );

    this.state.currentChatboxStateObs.subscribe((res: any) => {
      let data = JSON.parse(res);
      for (let i = 0; i < this.minimizedChats.length; i++) {
          if(i == data.index){
            this.minimizedChats[i].windowState = data.state;
          }else{
            this.minimizedChats[i].windowState = 'minimized';
          }
      }
      console.log("After Update: ", this.minimizedChats);
    })
  }

  openDialog(index){
    let state = 'opened';
    this.state.updateChatboxState(state, index);
  }

  close(index){
    let state = 'closed';
    this.state.updateChatboxState(state, index);
  }

}
