import { PusherService } from './pusher.service';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// const Pusher = require('pusher');
import Pusher from 'pusher-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ace My Tax';
  message;
  messageList;
  pusher;
  constructor(public http:HttpClient, private pusherService:PusherService){
    let postObj = {
      "message":"Message from Diwakar"
    }
    // this.http.post('http://54.186.217.203:5009/message',
    //  postObj,
    // ).subscribe(m => {
    //    console.log(m);
    // });

  //   this.pusherService.channel.bind("message-exchange", data =>{
  //     console.log(data);
  //     this.messageList = data;
  //   })
  // }

  // push(){
  //   console.log(this.message)
  // }
  }
}
