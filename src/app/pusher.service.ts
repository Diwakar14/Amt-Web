import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
declare const Pusher: any;
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  channel: any;
  chatBoxChannel: any;
  constructor(private cookie: CookieService) {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true,
      authEndpoint: environment.apiEndPoint + 'auth/pusher',
      auth: {
        headers: {
          Authorization: 'Bearer ' + this.cookie.get('auth_token'),
        }
      } 
    });

    this.channel = this.pusher.subscribe('presence-acemytax');

    
  }

  subscribeForChatBox(subscriptionId){
    this.chatBoxChannel = this.pusher.subscribe(subscriptionId)
  }
}
