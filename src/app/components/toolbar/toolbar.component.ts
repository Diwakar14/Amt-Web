import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router, private uiService: UIService) { }

  title;
  ngOnInit(): void {
    this.title = this.router.url;
    this.uiService.currentApprovalStageMessage.subscribe(
      res => console.log("Toolbar - ", res)
    )
  }

  toggleSidebar(){
    this.uiService.updateApprovalMessage("I am updating the dom");
  }

}
