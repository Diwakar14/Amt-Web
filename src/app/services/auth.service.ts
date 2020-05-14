import { environment } from './../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Users } from './../models/usersModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  users;
  currentUserValue(){
    return this.users;
  }


  login(user: Users){
    return this.http.post(environment.apiEndPoint + "auth/login/email", user, {observe: 'response'})
      .pipe(map((user:any) => {
        this.users = user;
        return user;
      }));
  }

  getStatus(){
    let token = this.cookie.get('access_token');
    let header = new HttpHeaders().set("Authorization","Bearer "+token);
    return this.http.get("http://54.186.217.203:5009/validate", {headers:header});
  }

  logout(){
    return this.http.post(environment.apiEndPoint + "auth/logout", null);
  }
}
