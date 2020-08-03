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
    "sidebar": false,
    "users": []
  }

  toolbarTitle = "Dashboard";

  refreshPayment = false;


  private approvalStageMessage = new BehaviorSubject(JSON.stringify(this.state));
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  private approvalStageToolbarMessage = new BehaviorSubject(JSON.stringify(this.toolbarTitle));
  currentApprovalStageToolbarMessage = this.approvalStageToolbarMessage.asObservable();

  private approvalStageRefreshMessage = new BehaviorSubject(JSON.stringify(this.refreshPayment));
  currentApprovalStageRefreshMessage = this.approvalStageRefreshMessage.asObservable();

  constructor() { }

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
    this.toolbarTitle = state;
    this.approvalStageRefreshMessage.next(JSON.stringify(this.refreshPayment));
  }
}
