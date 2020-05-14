import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Users } from './../../models/usersModel';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var Notiflix:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading:boolean = false;

  users: Users = new Users();
  constructor(
    public authService: AuthService, 
    private router: Router, 
    private cookie:CookieService) { }

  ngOnInit(): void {
    if(this.cookie.check('auth_token')){
      this.router.navigateByUrl('/dashboard');
    }
  }

  login(f:NgForm){
    this.loading = true;
    let users:Users = f.value;
    this.authService.login(users).subscribe(
      res => {
        this.cookie.set("auth_token", res.headers.get('Authorization'));
        this.router.navigateByUrl('/dashboard');
        this.loading = false;
        Notiflix.Notify.Success('Login Success !');
      },
      err => {
        Notiflix.Notify.Failure('Login Failed !');
      }
    );
  }
}
