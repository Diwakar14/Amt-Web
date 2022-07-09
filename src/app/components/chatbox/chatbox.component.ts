import { UIService } from './../../services/ui.service';
import { PusherService } from '../../pusher.service';
import { DocumentService } from '../../services/document.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '../../services/chat.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { debounceTime, take, delay } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
declare var Notiflix: any;

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
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
export class ChatboxComponent implements OnInit, AfterViewInit, OnDestroy {
  allChats = {
    messages: []
  };
  userId;
  chatId;
  fileFormates = [
    '/assets/img/newFileIcons/pdf.png',
    '/assets/img/newFileIcons/txt.png',
    '/assets/img/newFileIcons/zip.png',
    '/assets/img/newFileIcons/doc.png',
    '/assets/img/newFileIcons/word.png',
    '/assets/img/newFileIcons/excel.png',
  ];
  
  chat = {
    text: '',
    chat:'',
    client_online:false,
    client:''
  }

  @ViewChild('attachment', { static: false }) attachment: ElementRef;
  @ViewChild('chatboxlist') chatboxlist: ElementRef<HTMLDivElement>;
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;
  @Input() chatData;
  presenceChannel: any;
  
  constructor(
    private chatService: ChatService, 
    private documentService: DocumentService,
    private pusherService: PusherService) { 
      
    }
  
  ngAfterViewInit(): void {
    if(this.chatData.chat){
      this.pusherService.subscribeForChatBox(this.chatData.chat);
    }else{
      Notiflix.Notify.Success("You are not joined to chat room.");
    }
    this.pusherService.chatBoxChannel.bind("chat-message", data =>{
      this.allChats.messages.push(JSON.parse(data.message));
      setTimeout(() => {
        this.processChatList(this.allChats);
        this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
      })
    });

    this.pusherService.chatBoxChannel.bind("client-typing", data =>{
      // console.log("Typing start - ", data);
    });
    this.pusherService.chatBoxChannel.bind("client-typing-stop", data =>{
      // console.log("Typing end - ", data);
    });
    this.pusherService.chatBoxChannel.bind("pusher:member_added", data =>{
      // console.log("Chat box Online -", data);
      if((this.userId == data.id) && data.info.roles[0].role == 'Client'){
        this.chat.client_online = true;
      }
    });
    this.pusherService.chatBoxChannel.bind("pusher:subscription_succeeded", data =>{
      // console.log("chatbox S -", data);
      for (const property in data.members) {
        let onlineMem = data.members[property];
        if((this.userId == onlineMem.id) && onlineMem.roles[0].role == 'Client'){
          this.chat.client_online = true;
        }
      }
    });
    
    this.pusherService.chatBoxChannel.bind("pusher:member_removed", data =>{
      // console.log("chatbox -Offline -", data);
      if((this.userId == data.id) && data.info.roles[0].role == 'Client'){
        this.chat.client_online = false;
      }
    });
  }

  

  ngOnInit(): void {
    this.userId = this.chatData.clientId;
    this.chatService.getChats(this.chatData.chat)
      .pipe(debounceTime(3000), delay(600))
      .subscribe(
        (res:any) => { 
          this.allChats = this.processChatList(res);
          setTimeout(() => {
            this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
          }, 1)
        }
    );    
  }

  uploadDoc(){
    let files = this.attachment.nativeElement.files;
    var formdata = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formdata.append('documents['+i+']', files[i]);
    }
    formdata.append('user', this.userId);
    formdata.append('chat', this.chatData.chat);
    this.documentService.uploadDocument(formdata, this.userId).pipe(
      debounceTime(3000),
    ).subscribe(
      res => {
        this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
      },
      err => {
        console.log(err);
      }
    );
  }
  sendMessage(){
    this.chat.chat = this.chatData.chat;
    this.chat.client = this.userId;
    // console.log(this.chat);
    if(this.chat.text){
      this.chatService.sendChat(this.chat).pipe(
        take(1),
        debounceTime(3000))
        .subscribe(
          res => {
            this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
            this.processChatList(this.allChats);
          },
          err => {
            console.log(err);
          }
        )
      this.chat.text = '';
    }
  }

  downloadDoc(chat){
    this.documentService.downloadDoc(chat.preview.id).subscribe((res: any) => {
      this.downLoadFile(res, chat.preview.type, chat.preview.name);
    })
  }

  private downLoadFile(data: any, type: string, filename: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);

    const link = this.download.nativeElement;
    if(link){
      link.href = url;
      link.download = filename;
      link.click();
    }
  }

  private processChatList(chats: any){
    let datetimeChecker = new Date();
    let flag = '';
    let uniqueUser = '';
    for (let i = 0; i < chats.messages.length; i++) {
      let date = this.formateTime(chats.messages[i].created_at);
      if(datetimeChecker.toLocaleDateString() == date.toLocaleDateString()){
        if(flag != date.toLocaleDateString()){
          chats.messages[i].currentState = 'Today';
          flag = date.toLocaleDateString();
        }
      }else{
        if(flag != date.toLocaleDateString()){
          chats.messages[i].state = date;
          flag = date.toLocaleDateString();
        }
      }

      if(chats.messages[i].sender_id != uniqueUser){
        chats.messages[i].unique = true;
        uniqueUser = chats.messages[i].sender_id;
      }
    }
    // console.log(chats);
    return chats;
  }

  private formateTime(date){
    return new Date(date + ' UTC');
  }

  ngOnDestroy(): void {
    this.pusherService.chatBoxChannel.unbind();
    this.pusherService.unsubscribeChatRoom(this.chatData.chat);
  }
}
