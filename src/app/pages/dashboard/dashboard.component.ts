import { PusherService } from './../../pusher.service';
import { UIService } from './../../services/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  channel: any;
  chatStateData;
  minimizedChats = [];
  actionEvent = 1;

  constructor(
    public authSerive: AuthService, 
    public router: Router,
    private activatedRoute: ActivatedRoute,  
    private pusherService: PusherService,
    private state: UIService) {
      this.activatedRoute.data.subscribe((data:any) => {
        this.state.updateApprovalToolbarMessage(data.title);
      });
   }

   style = {
     sidebar:'16%',
     main:'86%'
   }

  ngOnInit(): void {
    this.state.currentApprovalStageMessage.subscribe((change) => {
      let state = JSON.parse(change);
      if(state.sidebar === true){
        this.style.main = '100%';
        this.style.sidebar = '0%';
      }else{
        this.style.main = '100%';
        this.style.sidebar = '16%';
      } 
    });
  }
  
  newMessageAlert(chatId){
    if(chatId){
      this.pusherService.subscribeForChatBox(chatId);
    }
    this.pusherService.chatBoxChannel.bind("chat-message", data =>{
      console.log(data);
      this.minimizedChats.map(item => {
        if((parseInt(item.clients.clientId) == JSON.parse(data.message).sender_id) && (item.windowState == 'minimized')){
          let alert = new Audio();
          alert.src = '../../../assets/tone/alert.mp3';
          alert.volume = 1;
          alert.play();
          item.newMessage = true;
        }
      })
    });
  }

  openChatbox(eventData){
    this.chatStateData = eventData;
    let findOpenedBox = this.minimizedChats.findIndex(m => m.clients.clientId == this.chatStateData.clients.clients.clientId);
    if(findOpenedBox == -1){
      this.minimizedChats[this.chatStateData.index] = this.chatStateData.clients;
      this.newMessageAlert(eventData.clients.clients.chat);
      console.log(this.minimizedChats);
      for (let i = 0; i < this.minimizedChats.length; i++) {
        if(this.chatStateData.index != i){
          this.minimizedChats[i].windowState = 'minimized';
        }          
      }
    }else{
      for (let i = 0; i < this.minimizedChats.length; i++) {
        this.minimizedChats[i].windowState = 'minimized';
      }
      if(this.minimizedChats[findOpenedBox].windowState == 'minimized'){
        this.minimizedChats[findOpenedBox].windowState = 'opened';
      }
    }
  }

  logout(){
    this.authSerive.logout();
    this.router.navigateByUrl('/login');
  }
  
  action(data){
    if(data.state == 'closed'){
      this.minimizedChats.splice(data.index, 1);
      this.state.updateIndex(this.minimizedChats.length);

    }else if(data.state == 'minimized'){
      this.minimizedChats[data.index].windowState = 'minimized';
    }
  }

  openDialog(index){
    if(this.minimizedChats[index].windowState == 'minimized'){
      this.minimizedChats[index].windowState = 'opened';
      
      if(this.minimizedChats[index].newMessage){
        this.minimizedChats[index].newMessage = false;
      }
    }
  }
  close(index){
    this.minimizedChats.splice(index, 1);
    this.state.updateIndex(this.minimizedChats.length);
  }

  onActivate(componentReference) {
    if(componentReference.chatbox){
      componentReference.chatbox.subscribe((data: any) => {
        console.log("router",data);
        this.openChatbox(data);
      });
    }
 }
}
