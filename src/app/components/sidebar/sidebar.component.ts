import { Title } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';
import { PusherService } from './../../pusher.service';
import { UserService } from './../../services/user.service';
import { UIService, IClients, ChatboxState } from './../../services/ui.service';
import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription, fromEvent } from 'rxjs';
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
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  isExpanded = false;
  clients = [];
  filteredClients = [];
  userOnlinelist = [];
  onlineClients = [];
  loader = true;
  usersList = [];
  channel: any;
  index = 0;

  searchSubscription = new Subscription();

  @Output() change = new EventEmitter();
  @Input() action;
  @ViewChild('search_client') searchField:ElementRef<HTMLInputElement>;
  
  constructor(private uiService: UIService, 
    private title:Title,
    private pusherService: PusherService,
    private userService: UserService) {
      this.uiService.currentIndex$.subscribe((res: any) => {
        this.index = JSON.parse(res);
        this.usersList.splice(this.index, this.usersList.length - this.index);
      });
  }
  
  ngAfterViewInit(): void {
    this.searchSubscription = fromEvent(this.searchField.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        map((event: Event) => (<HTMLInputElement>event.target).value ),
        tap(() => {
          this.loader = true;
          this.filteredClients = [];
        }),
        switchMap(value => this.userService.AllClients(value))
      )
      .subscribe(
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

    console.log("Pusher init().");
    this.pusherService.init();

    this.connectToPusherAndGetClients(); // Initial Pusher Connection...

    this.channel.bind("pusher:subscription_error", data =>{
      console.log("Error 1 - ",data);
      this.connectToPusherAndGetClients(); // Connect again on any error...
    });
    
    this.channel.bind("pusher:member_added", data =>{
      let temp;
      let clientActiveIndex = this.filteredClients.findIndex(item => item.id == data.id);
      if(clientActiveIndex >= 0){
        this.filteredClients[clientActiveIndex].online = true;
        temp = this.filteredClients[clientActiveIndex];
        for (let i = clientActiveIndex; i >= 0; i--) {
          this.filteredClients[i] = this.filteredClients[i -1]
        }
        this.filteredClients[0] = temp;
      }else if(data.info.roles[0].role == 'Client'){
        this.filteredClients.unshift(data.info);
        this.filteredClients[0].online = true;
      }
    });
    this.channel.bind("pusher:member_removed", data =>{
      // console.log('Offline', data);
      this.filteredClients.map(item => {
        if(item.id == data.id){
          item.online = false;
        }
      })
    });
    this.channel.bind("unread_message", data =>{
      let temp;
      console.log('Unread message', data);
      let clientActiveIndex = this.filteredClients.findIndex(item => item.id == JSON.parse(data.message).sender_id);
      this.filteredClients[clientActiveIndex].chat.isUnreadClientMessage = true;
      temp = this.filteredClients[clientActiveIndex];
      for (let i = clientActiveIndex; i >= 0; i--) {
        this.filteredClients[i] = this.filteredClients[i -1]
      }
      this.filteredClients[0] = temp;

      this.title.setTitle('Ace My Tax • New Message');
    });
    this.channel.bind("message_read", data =>{
      console.log('message read complete - ', data);
      let clientActiveIndex = this.filteredClients.findIndex(item => item.id == data.message.id);
      this.filteredClients[clientActiveIndex].chat.isUnreadClientMessage = false;
      this.title.setTitle('Ace My Tax');
    });
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
      this.usersList[this.index] = clientDetails;
      console.log(this.index);
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

  private connectToPusherAndGetClients(){
    this.channel = this.pusherService.subscribeToPresenceChannel('presence-acemytax');  

    this.channel.bind("pusher:subscription_succeeded", data =>{
      console.log("Subscribed - ", data);
      for (const property in data.members) {
        let onlineMem = data.members[property];
        this.filteredClients.map(item => {
          if((item.id == onlineMem.id) && onlineMem.roles[0].role == 'Client'){
            item.online = true;
          }
        });
      }

      for (let j = 0; j < this.filteredClients.length; j++) {
        if((this.filteredClients[j].online == true || this.filteredClients[j].chat.isUnreadClientMessage) && (j != 0)){
          let temp = this.filteredClients[j];
          for (let i = j; i >= 0; i--) {
            this.filteredClients[i] = this.filteredClients[i - 1]
          }
          this.filteredClients[0] = temp;
        }
      }
    });
  }


  addActiveClass(index){
    let items = document.querySelectorAll(".chatList-item");
    items.forEach(item => item.classList.remove('chatActive'));
    let itemActive = document.querySelector('#chats_'+ index);
    itemActive.classList.add('chatActive');
  }
  
  ngOnDestroy(): void {
    this.pusherService.unsubscribePresenceChannel('presence-acemytax');
  }

}
