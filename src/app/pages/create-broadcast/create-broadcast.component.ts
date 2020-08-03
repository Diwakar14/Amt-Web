import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIService } from 'src/app/services/ui.service';
declare var $:any;
@Component({
  selector: 'app-create-broadcast',
  templateUrl: './create-broadcast.component.html',
  styleUrls: ['./create-broadcast.component.scss']
})
export class CreateBroadcastComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private uiService: UIService
  ) { 
    this.activatedRoute.data.subscribe((data:any) => {
      this.uiService.updateApprovalToolbarMessage(data.title);
    });
  }

  ngOnInit(): void {
    
  }

}
