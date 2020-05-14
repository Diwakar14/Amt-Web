import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getOnlineUsers(){
    return this.http.get(environment.apiEndPoint + 'users/online/clients');
  }
}
