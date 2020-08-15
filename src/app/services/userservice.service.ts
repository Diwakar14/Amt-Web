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
  getUserServiceStatus(serviceId: number,){
    return this.http.get(environment.apiEndPoint+'user_service/'+serviceId+'/status');
  }
  createUserService(usersService){
    return this.http.post(environment.apiEndPoint+'user_service', usersService);
  }
  updateUserService(serviceId: number, status){
    return this.http.put(environment.apiEndPoint + 'user_service/' + serviceId, status)
  }
}
