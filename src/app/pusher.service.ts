import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import Pusher from 'pusher-js';
// declare var Pusher: any;
@Injectable({
  providedIn: 'root'
})

export class PusherService {
  pusher: any;
  channel: any;
  chatBoxChannel: any;
  presenceChannel: any;
  constructor(private cookie: CookieService) {
  }

  init(){
    // console.log("Before starting pusher")
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      authEndpoint: environment.apiEndPoint + 'auth/pusher',
      auth: {
        headers: {
          Authorization: 'Bearer ' + this.cookie.get('auth_token'),
        },
      }
    });
    // console.log("Pusher object created.", this.pusher);
    // this.pusher.connection.bind('state_change', function(states) {
    //   console.log("Channels current state is " + states.current);
    // });
    // this.pusher.connection.bind('error', function(error) {
    //   console.log('connection error', error)
    // });
  }

  subscribeToPresenceChannel(channelId){
    this.presenceChannel = this.pusher.subscribe(channelId);
    return this.presenceChannel;
  }
  subscribeForChatBox(chat_room){
    this.chatBoxChannel = this.pusher.subscribe(chat_room)
  }

  unsubscribeChatRoom(chat_room){
    this.pusher.unsubscribe(chat_room);
    // console.log('chat room close', chat_room)
  }
  unsubscribePresenceChannel(channelId){
    this.pusher.unsubscribe(channelId);
    // console.log('Presence Channel Closed', channelId);
  }
}
