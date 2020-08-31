import { LocaleServiceService } from './services/locale-service.service';
import { PusherService } from './pusher.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// const Pusher = require('pusher');
import Pusher from 'pusher-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Ace My Tax';
  constructor(private local: LocaleServiceService){
    
  }
  ngAfterViewInit(): void {
    this.local.setDefaultTimezone();
  }
  
}
