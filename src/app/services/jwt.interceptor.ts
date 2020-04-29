import { Users } from './../models/usersModel';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private cookie:CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let currentUser:Users = <Users><unknown>this.authService.currentUserValue;

    console.log(request.headers.get('Authorization'));
    
    if (currentUser) {
      this.cookie.set('auth_token', request.headers.get('Authorization'));
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${request.headers.get('Authorization')}`
            }
        });
    }
    return next.handle(request);
  }
}
