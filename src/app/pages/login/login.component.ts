import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Users } from './../../models/usersModel';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading:boolean = false;

  users: Users = new Users();
  constructor(public authService: AuthService, private router: Router, private cookie:CookieService) { }

  ngOnInit(): void {

  }

  login(f:NgForm){
    this.loading = true;
    let users:Users = f.value;
    console.log(users);
    this.authService.login(users).subscribe(model => {
      if(model){
        this.cookie.set("access_token", model['token']);
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
}
