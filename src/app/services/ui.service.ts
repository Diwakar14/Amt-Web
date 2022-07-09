import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IClients{
  clientId: string,
  name: string,
  email: string,
  phone: number,
  chat: string,
  index: number
}
export class ChatboxState{
  windowState: string; // closed || minimized || opened
  clients: IClients // Client active for chat.
}

export class ChatboxStateArray{
  onlineChats: ChatboxState[] = [];
}


@Injectable({
  providedIn: 'root'
})

export class UIService {

  state = {
    "collapse": "collapse",
    "sidebar": false,
    "users": []
  }

  toolbarTitle = "Dashboard";

  refreshPayment = false;
  index = 0;


  private approvalStageMessage = new BehaviorSubject(JSON.stringify(this.state));
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  private approvalStageToolbarMessage = new BehaviorSubject(JSON.stringify(this.toolbarTitle));
  currentApprovalStageToolbarMessage = this.approvalStageToolbarMessage.asObservable();

  private approvalStageRefreshMessage = new BehaviorSubject(JSON.stringify(this.refreshPayment));
  currentApprovalStageRefreshMessage = this.approvalStageRefreshMessage.asObservable();
  
  private index$ = new BehaviorSubject(JSON.stringify(this.index));
  currentIndex$ = this.index$.asObservable();

  constructor() { 
    
  }

  updateApprovalMessage(state) {
    this.state.collapse = state.collapse;
    this.state.sidebar = state.sidebar;
    this.state.users = state.users;
    this.approvalStageMessage.next(JSON.stringify(state));
  }

  updateApprovalToolbarMessage(state) {
    this.toolbarTitle = state;
    this.approvalStageToolbarMessage.next(JSON.stringify(this.toolbarTitle));
  }
  updateApprovalRefreshMessage(state) {
    this.refreshPayment = state;
    this.approvalStageRefreshMessage.next(JSON.stringify(this.refreshPayment));
  }

  updateIndex(state) {
    // console.log(state)
    this.index = state;
    this.index$.next(JSON.stringify(this.index));
  }



 
}
