import { UIService } from './../../services/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    public authSerive: AuthService, 
    public router: Router,
    
    private activatedRoute: ActivatedRoute,  
    private state: UIService) {
      this.activatedRoute.data.subscribe((data:any) => {
        this.state.updateApprovalToolbarMessage(data.title);
      });
   }

   style = {
     sidebar:'16%',
     main:'86%'
   }

  ngOnInit(): void {
    this.state.currentApprovalStageMessage.subscribe((change) => {
      let state = JSON.parse(change);
      if(state.sidebar === true){
        this.style.main = '100%';
        this.style.sidebar = '0%';
      }else{
        this.style.main = '100%';
        this.style.sidebar = '16%';
      } 
    })
  }


  logout(){
    this.authSerive.logout();
    this.router.navigateByUrl('/login');
  }

}
