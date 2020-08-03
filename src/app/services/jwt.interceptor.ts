import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Users } from './../models/usersModel';
import { AuthService } from './auth.service';
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
declare var Notiflix:any;

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, 
    public cookie:CookieService,
    public router:Router) {
    }


    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      let currentUser:any = <unknown>this.authService.currentUserValue;
      let access_token = this.cookie.get('auth_token');
      
      if (currentUser) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${access_token}`
              }
          });
      }
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status === 401){
            Notiflix.Notify.Failure(error.error.message);
            this.cookie.delete('auth_token');
            this.router.navigateByUrl('/login');
          }else if(error.status === 403){
            this.cookie.delete('auth_token');
            Notiflix.Notify.Failure(error.error.message);
            this.router.navigateByUrl('/login');
          }else if(error.status === 500){
            Notiflix.Notify.Failure(error.error.message);
          }
          return throwError(error);
        })
      );  
    }
}
