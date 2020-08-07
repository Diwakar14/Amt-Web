import { PusherService } from './../../pusher.service';
import { UserService } from './../../services/user.service';
import { UIService, IClients, ChatboxState } from './../../services/ui.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  isExpanded = false;
  clients = [];
  filteredClients = [];
  userOnlinelist = [];
  onlineClients = [];
  loader = true;
  usersList = [];
  channel: any;
  constructor(private uiService: UIService, 
    private pusherService: PusherService,
    private userService: UserService) {
    
  }
  ngAfterViewInit(): void {
    this.uiService.currentChatboxState.subscribe(
      (res: any) => {
        this.usersList = JSON.parse(res).onlineChats;
      }
    )
  }
  
  ngOnInit(): void {
    this.loader = true;
    this.userService.AllClients('').subscribe(
      (res:any) => {
        if(res.success == 1){
          this.filteredClients = res.clients.data;
          this.loader = false;
        }
      },
      err => {
        console.log('Error ', err);
        this.loader = false;
      }
    );

    this.pusherService.channel.bind("pusher:subscription_succeeded", data =>{
      // console.log("Subscribed -", data);
      for (const property in data.members) {
        let onlineMem = data.members[property];
        this.filteredClients.map(item => {
          if(item.id == onlineMem.id){
            item.online = true;
          }
        });
      }
    });
    this.pusherService.channel.bind("pusher:subscription_error", data =>{
      // console.log("Error 1 -",data);
    });
    this.pusherService.channel.bind("pusher:member_added", data =>{
      // console.log("Online  -",data);
      this.filteredClients.map(item => {
        if(item.id == data.id){
          item.online = true;
        }
      });
      // this.filteredClients[0].online = true;
      // console.log("filtered ", this.filteredClients);
    });
    this.pusherService.channel.bind("pusher:member_removed", data =>{
      // console.log('Offline', data);
      this.filteredClients.map(item => {
        if(item.id == data.id){
          item.online = false;
        }
      })
    });
  }

  search(searchData){
    this.loader = true;
    this.filteredClients = [];
    let data = searchData.target.value.toLowerCase();
    this.userService.AllClients(data).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      (res: any) => {
        this.filteredClients = res.clients.data;
        this.loader = false;
      },
      err => {
        console.log('Error ', err);
        this.loader = false;
      }
    );
  }

  userDetails(user, i){
    let chatboxState: ChatboxState = new ChatboxState();
    let clientDetails: IClients = {
      clientId: '' + user.id + '',
      name: '' + user.name + '',
      email: '' + user.email + '',
      phone: user.phone,
      chat: '' + user.chat.chat_room,
      index: i
    };

    let finduser = this.usersList.findIndex((m: ChatboxState) => parseInt(m.clients.clientId) === parseInt(clientDetails.clientId));

    if(finduser == -1){
      chatboxState.windowState = 'opened';
      chatboxState.clients = clientDetails;
      this.usersList.push(clientDetails);
      this.uiService.addNewChatboxState(chatboxState);
    }else{
      let state = 'opened';
      this.uiService.updateChatboxState(state, finduser);
    }
    this.addActiveClass(i);
  }

  reload(){
    this.ngOnInit();
  }
  addActiveClass(index){
    let items = document.querySelectorAll(".chatList-item");
    items.forEach(item => item.classList.remove('chatActive'));
    let itemActive = document.querySelector('#chats_'+ index);
    itemActive.classList.add('chatActive');
  }
}
