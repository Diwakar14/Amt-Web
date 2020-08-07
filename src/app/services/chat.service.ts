import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  getChats(chatId){
    return this.http.get(environment.apiEndPoint + "message?chat=" + chatId);
  }

  sendChat(chat){
    return this.http.post(environment.apiEndPoint + "message", chat);
  }
}
