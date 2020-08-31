import { DashboardService } from './../../services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  dashboard;
  constructor(private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private state: UIService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data:any) => {
      this.state.updateApprovalToolbarMessage(data.title);
    });

    this.dashboardService.getDashboardData().subscribe((res: any) => {
      this.dashboard = res.dashboard;
    }, err => {
      console.log(err);
    })
  }

}
