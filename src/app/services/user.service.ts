import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getOnlineUsers(){
    return this.http.get(environment.apiEndPoint + 'clients/online');
  }

  AllClients(q?: any){
    return this.http.get(environment.apiEndPoint + 'clients?q=' + q);
  }
  
  createClient(client){
    return this.http.post(environment.apiEndPoint + 'clients', client);
  }
  
  getChats(){
    return this.http.get(environment.apiEndPoint + 'clients/chat');
  }
  
  getPage(page){
    return this.http.get(environment.apiEndPoint + 'clients?page=' + page);
  }
}
