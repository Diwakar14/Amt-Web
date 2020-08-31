import { fadeAnimation } from './../../animation';
import { PusherService } from './../../pusher.service';
import { UIService } from './../../services/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations:[
    trigger('fadeAnimation', [
      transition(':enter', [style({ opacity: 0  }), 
        animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), 
        animate('200ms', style({ opacity: 0 }))])
    ])
  ]
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
      
      setTimeout(() => this.addActiveClass(this.chatStateData.index));
      
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
        this.addActiveClass(findOpenedBox);
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
      console.log(this.minimizedChats);

    }else if(data.state == 'minimized'){
      this.minimizedChats[data.index].windowState = 'minimized';
      this.removeActiveClass(data.index);
    }
  }

  openDialog(index){
    this.minimizedChats.map(item => item.windowState = 'minimized');

    if(this.minimizedChats[index].windowState == 'minimized'){
      this.minimizedChats[index].windowState = 'opened';
      
      if(this.minimizedChats[index].newMessage){
        this.minimizedChats[index].newMessage = false;
      }
    }
    this.addActiveClass(index);
  }

  close(index){
    this.minimizedChats.splice(index, 1);
    this.state.updateIndex(this.minimizedChats.length);
    console.log(this.minimizedChats);
  }

  onActivate(componentReference) {
    if(componentReference.chatbox){
      componentReference.chatbox.subscribe((data: any) => {
        this.openChatbox(data);
      });
    }
 }


  addActiveClass(index){
    let items = document.querySelectorAll(".chatbox");
    items.forEach(item => item.classList.remove('active-chat'));
    let itemActive = document.querySelector('#chatbox_'+ index);
    itemActive.classList.add('active-chat');
  }

  removeActiveClass(index){
    let itemActive = document.querySelector('#chatbox_'+ index);
    itemActive.classList.remove('active-chat');
  }
}
