import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Users } from './../../models/usersModel';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var Notiflix:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loading:boolean = false;

  users: Users = new Users();
  constructor(
    public authService: AuthService, 
    private router: Router, 
    private cookie:CookieService) { }
    
  ngAfterViewInit(): void {
    if(this.cookie.check('auth_token')){
      // this.router.navigateByUrl('/dashboard');
    }
  }

  ngOnInit(): void {
    
  }

  login(f:NgForm){
    this.loading = true;
    let users:Users = f.value;
    this.authService.login(users).subscribe(
      res => {
        this.cookie.set("auth_token", res.headers.get('Authorization'));
        localStorage.setItem('_user_id', res.body.user.id);
        localStorage.setItem('_user_name', res.body.user.name);
        this.loading = false;
        Notiflix.Notify.Success('Login Success !');
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        Notiflix.Notify.Failure('Login Failed !');
        this.loading = false;
      }
    );
  }
}
