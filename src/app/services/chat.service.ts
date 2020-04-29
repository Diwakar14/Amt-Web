import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  getChats(chatId){
    return this.http.get("http://54.186.217.203:5009/message?chat_id="+chatId, {
      headers:{
        "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC81NC4xODYuMjE3LjIwMzo1MDA5XC9cL2F1dGhcL2xvZ2luXC9lbWFpbCIsImlhdCI6MTU4ODE0NzIxOCwiZXhwIjoxNjI0MTQ3MjE4LCJuYmYiOjE1ODgxNDcyMTgsImp0aSI6IkMzZzVxMnZ6TGtJNlZKbEsiLCJzdWIiOjIsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEiLCJpZCI6Miwicm9sZSI6W3siaWQiOjIsInJvbGUiOiJPcGVyYXRvciJ9XSwibmFtZSI6Ik9wZXJhdG9yIn0.OQOVn_4hwvznvYIMmutcrkmz4jlu97s6XOvGuDGaXfE"
      }
    });
  }

  sendChat(chat){
    return this.http.post('http://54.186.217.203:5009/message', chat, {
      headers:{
        "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC81NC4xODYuMjE3LjIwMzo1MDA5XC9cL2F1dGhcL2xvZ2luXC9lbWFpbCIsImlhdCI6MTU4ODE0NzIxOCwiZXhwIjoxNjI0MTQ3MjE4LCJuYmYiOjE1ODgxNDcyMTgsImp0aSI6IkMzZzVxMnZ6TGtJNlZKbEsiLCJzdWIiOjIsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEiLCJpZCI6Miwicm9sZSI6W3siaWQiOjIsInJvbGUiOiJPcGVyYXRvciJ9XSwibmFtZSI6Ik9wZXJhdG9yIn0.OQOVn_4hwvznvYIMmutcrkmz4jlu97s6XOvGuDGaXfE"
      }
    });
  }
}
