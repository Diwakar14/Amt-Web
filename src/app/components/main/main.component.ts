import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute,
    private state: UIService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data:any) => {
      this.state.updateApprovalToolbarMessage(data.title);
    });
  }

}
