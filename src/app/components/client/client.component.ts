import { UIService } from './../../services/ui.service';
import { trigger, style, animate, transition, state, query } from '@angular/animations';
import { Component, OnInit, Input, AfterContentInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations:[
    trigger('slideUp', [
      // state('initial', style({opacity: 0, height:0})),
      // state('final', style({opacity:1, height:'*'})),

      // transition('initial <=> final', animate('600ms cubic-bezier(.87,0,.01,1.01)')),
      // transition('final => initial', animate('600ms cubic-bezier(.87,0,.01,1.01)')),
      transition('void => *', [
          style({opacity: 0, width:'0%', height:'0%'}),
          animate('400ms cubic-bezier(.87,0,.01,1.01)')
      ]),
      transition('* => void', [
          style({opacity:1, width:'90%', height:'90%'}),
          animate('400ms cubic-bezier(.87,0,.01,1.01)')
      ])
      ])
    ]
  })
export class ClientComponent implements OnInit, AfterViewInit {

  constructor(private uiService: UIService) { }

  @Input() windowState;
  @Input() chatData;
  loading = true;
  userState = {
    user: {
      name:'',
      windowState:'',
      userId:''
    }
  };

  @Input() index;
  windowStateInput;

  ngOnInit(): void {
    this.userState.user.name = this.chatData.name;
    this.userState.user.userId = this.chatData.userId;
    this.userState.user.windowState = this.chatData.windowState;
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.loading = false;
    },3000);
  }
  close(){
    let currentState = [];
    let userObj = {
      userId:''+this.userState.user.userId+'',
      windowState: false,
      name:''+this.userState.user.name+''
    }

    this.uiService.currentApprovalStageMessage.subscribe((changes) => {
      currentState = JSON.parse(changes).users;
    });

    let index = currentState.findIndex(m => parseInt(m.userId) === parseInt(userObj.userId));
    currentState.splice(index, 1);
    this.uiService.updateApprovalMessage({
      users: currentState
    })
  }
}
