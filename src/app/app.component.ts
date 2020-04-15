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
  title = 'amtweb';
  message;
  messageList;
  pusher;
  constructor(public http:HttpClient, private pusherService:PusherService){
    let postObj = {
      "message":"Message from Diwakar"
    }
    // const header = new HttpHeaders().set("Access-Control-Allow-Origin","*");
     this.http.post('http://54.186.217.203:5009/message',
     postObj,
    //  {
    //    headers:{
    //      "Access-Control-Allow-Origin":"*",
    //      "Access-Control-Request-Method":"GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //      "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, Authorization",
    //      "Access-Control-Allow-Credentials": "true"
    //    }
    //  }
    ).subscribe(m => {
       console.log(m);
    });

    this.pusherService.channel.bind("message-exchange", data =>{
      console.log(data);
      this.messageList = data;
    })
  }

  push(){
    console.log(this.message)
  }
}
