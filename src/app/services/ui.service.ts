import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface users{
  userId: number,
  windowState: false,
  name: string
}

@Injectable({
  providedIn: 'root'
})

export class UIService {

  state = {
    "collapse": "collapse",
    "windowOpen": false,
    "users": []
  }


  private approvalStageMessage = new BehaviorSubject(JSON.stringify(this.state));
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  constructor() { }

  updateApprovalMessage(state) {
    this.state.collapse = state.collapse;
    this.state.windowOpen = state.windowOpen;
    this.state.users = state.users;
    this.approvalStageMessage.next(JSON.stringify(state));
  }
}
