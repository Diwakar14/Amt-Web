import { PusherService } from '../../pusher.service';
import { DocumentService } from '../../services/document.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '../../services/chat.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit, AfterViewInit {
  allChats = {
    messages: []
  };
  userId;
  chatId = 'ios123';
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
    chat_id:'',
    sender_id: 0,
  }

  @ViewChild('attachment', { static: false }) attachment: ElementRef;
  @ViewChild('chatboxlist') chatboxlist: ElementRef<HTMLDivElement>;
  
  constructor(
    private chatService: ChatService, 
    private cookie:CookieService,
    private documentService: DocumentService,
    private pusherService: PusherService) { 
      
    }
  ngAfterViewInit(): void {
    this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
  }


  ngOnInit(): void {
    this.userId = this.cookie.get('id');
    this.chatService.getChats(this.chatId).pipe(debounceTime(3000)).subscribe(
      (res:any) => {
        this.allChats = res;
      }
    );
    this.pusherService.channel.bind("message-exchange", data =>{
      this.allChats.messages.push(JSON.parse(data.message));
    });
  }

  uploadDoc(){
    let files = this.attachment.nativeElement.files;
    var formdata = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formdata.append('documents['+i+']', files[i]);
    }
    formdata.append('chat_id', this.chatId);
    formdata.append('folder', '0');
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
    this.chat.chat_id = this.chatId;
    this.chat.sender_id = this.userId;
    this.chatService.sendChat(this.chat).pipe(debounceTime(3000)).subscribe(
      res => {
        this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
      },
      err => {
        console.log(err);
      }
    )
    this.chat.text = '';
  }
}
