import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './../../services/auth.service';
import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  loading: boolean = false;
  title;
  collaspe;
  users;
  date;
  username;
  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute,
    private uiService: UIService,
    private auth: AuthService,
    private cookie: CookieService) {
      this.username = localStorage.getItem('_user_name')
    }

  
  ngOnInit(): void {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.date = new Date().getDate() + " " + monthNames[new Date().getMonth()] + ", " + new Date().getFullYear();
    
    
    this.uiService.currentApprovalStageMessage.subscribe(
      (res:any) => {
        this.users = res;
      }
    );
    this.uiService.currentApprovalStageToolbarMessage.subscribe((res: any) => {
      this.title = JSON.parse(res);
    })
  }

  logout(){
    $("#logout").modal('show');
  }
  confirm(){
    this.loading = true;
    this.auth.logout().subscribe(
      res => {
        
        localStorage.removeItem('_user_id');
        localStorage.removeItem('_user_name');
        localStorage.clear();

        this.cookie.delete('auth_token', '/', null, null, "Lax");
        this.cookie.deleteAll('/');

        $("#logout").modal('hide');
        this.loading = false;
        setTimeout(() => {
          // this.router.navigateByUrl('/login');
          location.href = '/login';
        },1000);
      },
      err =>{
        console.log(err);
        this.loading = false;
      }
    );
  }

  toggleSidebar(){
    this.collaspe = !this.collaspe;
    this.uiService.updateApprovalMessage({
      sidebar: this.collaspe,
      users: JSON.parse(this.users).users
    });
  }

}
