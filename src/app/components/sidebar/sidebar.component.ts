import { trigger, transition, style, animate } from '@angular/animations';
import { PusherService } from './../../pusher.service';
import { UserService } from './../../services/user.service';
import { UIService, IClients, ChatboxState } from './../../services/ui.service';
import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations:[
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]
      ),
      transition(':leave',
        [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]
      )
    ])
  ]
})
export class SidebarComponent implements OnInit {

  isExpanded = false;
  clients = [];
  filteredClients = [];
  userOnlinelist = [];
  onlineClients = [];
  loader = true;
  usersList = [];
  channel: any;
  index = 0;   


  @Output() change = new EventEmitter();
  @Input() action;
  
  constructor(private uiService: UIService, 
    private pusherService: PusherService,
    private userService: UserService) {
      this.uiService.currentIndex$.subscribe((res: any) => {
        this.index = JSON.parse(res);
      });
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

    this.channel = this.pusherService.pusher.subscribe('presence-acemytax');  
    
    this.channel.bind("pusher:subscription_succeeded", data =>{
      console.log("Subscribed -", data);
      for (const property in data.members) {
        let onlineMem = data.members[property];
        this.filteredClients.map(item => {
          if(item.id == onlineMem.id){
            item.online = true;
          }else{
            item.online = false;
          }
        });
      }

      for (let j = 0; j < this.filteredClients.length; j++) {
        if((this.filteredClients[j].online == true) && (j != 0)){
          console.log('online')
          let temp = this.filteredClients[j];
          for (let i = j; i >= 0; i--) {
            this.filteredClients[i] = this.filteredClients[i - 1]
          }
          this.filteredClients[0] = temp;
        }
      }
    });
    this.channel.bind("pusher:subscription_error", data =>{
      console.log("Error 1 -",data);
    });
    this.channel.bind("pusher:member_added", data =>{
      console.log("Online  -",data);
      let temp;
      let clientActiveIndex = this.filteredClients.findIndex(item => item.id == data.id);
      if(clientActiveIndex >= 0){
        this.filteredClients[clientActiveIndex].online = true;
      }
      temp = this.filteredClients[clientActiveIndex];
      for (let i = clientActiveIndex; i >= 0; i--) {
        this.filteredClients[i] = this.filteredClients[i -1]
      }
      this.filteredClients[0] = temp;
      // console.log("filtered ", this.filteredClients);
    });
    this.channel.bind("pusher:member_removed", data =>{
      console.log('Offline', data);
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

    let userIndex = this.usersList.findIndex((m: IClients) => parseInt(m.clientId) === parseInt(clientDetails.clientId));
    if(userIndex == -1){
      chatboxState.windowState = 'opened';
      chatboxState.clients = clientDetails;
      this.usersList.push(clientDetails);
      this.change.emit({clients: chatboxState, index: this.index});
      this.index++;
      
    }else{
      chatboxState.windowState = 'opened';
      chatboxState.clients = clientDetails;
      this.change.emit({clients:chatboxState, index: userIndex})
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
  
  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const clientA = a.name.toUpperCase();
    const clientB = b.name.toUpperCase();
  
    let comparison = 0;
    if (clientA > clientB) {
      comparison = 1;
    } else if (clientA < clientB) {
      comparison = -1;
    }
    return comparison;
  }

}
