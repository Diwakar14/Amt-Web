import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(type){
    return this.http.get(environment.apiEndPoint + "notifications?type=" + type);
  }

  createNotifications(notif){
    return this.http.post(environment.apiEndPoint + "notifications", notif);
  }

  deleteNotifications(notifId){
    return this.http.delete(environment.apiEndPoint + "notifications/" + notifId);
  }
}
