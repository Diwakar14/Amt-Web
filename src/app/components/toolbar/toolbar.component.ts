import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './../../services/auth.service';
import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute,
    private uiService: UIService,
    private auth: AuthService,
    private cookie: CookieService) { }

  title;
  collaspe;
  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.title = data.title;
      console.log(this.title)
    });
    this.uiService.currentApprovalStageMessage.subscribe(
      (res:any) => {
        console.log("Toolbar - ", res);
      }
    );
  }

  logout(){
    this.auth.logout().subscribe(
      res => {
        this.cookie.delete('auth_token');
        this.router.navigateByUrl('/login');
      }
    );
  }

  toggleSidebar(){
    this.collaspe = !this.collaspe;
    this.uiService.updateApprovalMessage({
      collapse: this.collaspe,
    });
  }

}
