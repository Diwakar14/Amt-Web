import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  getChats(chatId){
    return this.http.get("http://54.186.217.203:5009/message?chat_id=" + chatId);
  }

  sendChat(chat){
    return this.http.post('http://54.186.217.203:5009/message', chat);
  }
}
