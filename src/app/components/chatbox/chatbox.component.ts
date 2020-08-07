import { UIService } from './../../services/ui.service';
import { PusherService } from '../../pusher.service';
import { DocumentService } from '../../services/document.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '../../services/chat.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { debounceTime, take } from 'rxjs/operators';

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
    chat:''
  }

  @ViewChild('attachment', { static: false }) attachment: ElementRef;
  @ViewChild('chatboxlist') chatboxlist: ElementRef<HTMLDivElement>;
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;
  @Input() chatData;
  
  constructor(
    private chatService: ChatService, 
    private cookie:CookieService,
    private uiService: UIService,
    private documentService: DocumentService,
    private pusherService: PusherService) { 
      
    }
  ngAfterViewInit(): void {
    this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
  }


  ngOnInit(): void {
    this.userId = this.chatData.clientId;
    this.chatService.getChats(this.chatData.chat)
      .pipe(debounceTime(3000))
      .subscribe(
        (res:any) => { 
          this.allChats = res;
          this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
        }
    );

    this.pusherService.subscribeForChatBox(this.chatData.chat);
    this.pusherService.chatBoxChannel.bind("pusher:subscription_succeeded", (data) => {
      // console.log(data);
    })
    
    this.pusherService.chatBoxChannel.bind("chat-message", data =>{
      this.allChats.messages.push(JSON.parse(data.message));
      // console.log(this.allChats);
    });
  }

  uploadDoc(){
    let files = this.attachment.nativeElement.files;
    var formdata = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formdata.append('documents['+i+']', files[i]);
    }
    formdata.append('chat', this.chatId);
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
    this.chat.chat = this.chatData.chat;
    console.log(this.chat);
    this.chatService.sendChat(this.chat).pipe(
      take(1),
      debounceTime(3000))
      .subscribe(
        res => {
          this.chatboxlist.nativeElement.scrollTop = this.chatboxlist.nativeElement.scrollHeight;
        },
        err => {
          console.log(err);
        }
      )
    this.chat.text = '';
  }

  downloadDoc(chat){
    console.log(chat);
    this.documentService.downloadDoc(chat.preview.id).subscribe((res: any) => {
      this.downLoadFile(res, chat.preview.type, chat.preview.name);
    })
  }

  private downLoadFile(data: any, type: string, filename: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);

    const link = this.download.nativeElement;
    link.href = url;
    link.download = filename;
    link.click();
  }
}
