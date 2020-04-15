import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public authSerive: AuthService, public router: Router) {
    // this.authSerive.getStatus().subscribe(m => {
    //   if(!m['success']){
    //     this.router.navigateByUrl('/login');
    //   }
    // });
   }

  ngOnInit(): void {
  }

  logout(){
    this.authSerive.logout();
    this.router.navigateByUrl('/login');
  }

}
