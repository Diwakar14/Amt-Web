import { UIService } from './../../services/ui.service';
import { trigger, style, animate, transition, state, query } from '@angular/animations';
import { Component, OnInit, Input, AfterContentInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations:[
    trigger('slideUp', [
        transition('* => void', [
          style({opacity:1, width:'*', height:'*'}),
          animate('400ms cubic-bezier(.87,0,.01,1.01)')
        ]),
        transition('void => *', [
          style({opacity: 0, width:0, height:0}),
          animate('400ms cubic-bezier(.87,0,.01,1.01)')
        ]),
      ]),
      trigger('slideDown', [
        state('minimized', style({opacity: 0, height:0})),
        state('opened', style({opacity: 1, height:'*'})),
        transition('* <=> minimized', animate('400ms cubic-bezier(.87,0,.01,1.01)')),
      ]),
    ]
  })
export class ClientComponent implements OnInit, AfterViewInit {

  constructor(private uiService: UIService) { }

  @Input() windowState;
  @Input() chatData;
  @Input() index;
  @Output() change = new EventEmitter();

  loading = true;
  userState = {
    user: {
      name:'',
      windowState:'',
      userId:''
    }
  };

  windowStateInput;

  ngOnInit(): void {   
    this.userState.user.name = this.chatData.name;
    this.userState.user.userId = this.chatData.clientId;
  }

  ngAfterViewInit(){
   console.log(this.windowState)
  }

  close(){
    let state = 'closed';
    this.change.emit({state:state, index: this.index});
  }


  minimize(){
    let state = 'minimized';
    this.change.emit({state:state, index: this.index});
  }
}
