import { CookieService } from 'ngx-cookie-service';
import { Users } from './../models/usersModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  users:Users;
  currentUserValue(){
    return this.users;
  }


  login(user: Users){
    return this.http.post("http://54.186.217.203:5009/login", user).pipe(map(user => {
      this.cookie.set('access_token', user['token']);
      this.users = <Users>user;
      return user;
    }));
  }

  getStatus(){
    let token = this.cookie.get('access_token');
    let header = new HttpHeaders().set("Authorization","Bearer "+token);
    return this.http.get("http://54.186.217.203:5009/validate", {headers:header});
  }

  logout(){
    this.users = null;
    this.cookie.delete('access_token');
  }
}