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

  chatboxStateArray: ChatboxStateArray = new ChatboxStateArray();
  

  toolbarTitle = "Dashboard";

  refreshPayment = false;


  private approvalStageMessage = new BehaviorSubject(JSON.stringify(this.state));
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  private approvalStageToolbarMessage = new BehaviorSubject(JSON.stringify(this.toolbarTitle));
  currentApprovalStageToolbarMessage = this.approvalStageToolbarMessage.asObservable();

  private approvalStageRefreshMessage = new BehaviorSubject(JSON.stringify(this.refreshPayment));
  currentApprovalStageRefreshMessage = this.approvalStageRefreshMessage.asObservable();

  private chatboxMessage = new BehaviorSubject(JSON.stringify(this.chatboxStateArray));
  currentChatboxState = this.chatboxMessage.asObservable();

  private updateChatboxStateObs = new BehaviorSubject(JSON.stringify({}));
  currentChatboxStateObs = this.updateChatboxStateObs.asObservable();

  constructor() { 
    this.chatboxStateArray.onlineChats.push(new ChatboxState());
    this.chatboxStateArray.onlineChats = [];
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

  addNewChatboxState(state: ChatboxState){
    this.chatboxStateArray.onlineChats.push(state);
    this.chatboxMessage.next(JSON.stringify(this.chatboxStateArray))
  }

  updateChatboxState(state, index){
    this.updateChatboxStateObs.next(JSON.stringify({
      state: state,
      index: index
    }));

    if(state == 'closed'){
      this.chatboxStateArray.onlineChats.splice(index, 1);
      this.chatboxMessage.next(JSON.stringify(this.chatboxStateArray))
    }
  }

 
}
