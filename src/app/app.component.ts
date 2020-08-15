import { LocaleServiceService } from './services/locale-service.service';
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
  constructor(private pusherService: PusherService, private local: LocaleServiceService){
    console.log("Pusher init().");
    this.pusherService.init();

    this.local.setDefaultTimezone();
  }
}
