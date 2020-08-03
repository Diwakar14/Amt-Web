import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(private http: HttpClient) { }


  getUserService(userId: number){
    return this.http.get(environment.apiEndPoint+'user_service/' + userId);
  }
  createUserService(usersService){
    return this.http.post(environment.apiEndPoint+'user_service', usersService);
  }
  updateUserService(serviceId: number){
    return this.http.get(environment.apiEndPoint+'user_service/' + serviceId)
  }
}
