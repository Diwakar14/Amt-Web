import { UIService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations:[
    trigger('expanded', [
      transition('* <=> *', [
        style({ opacity:0, height:'0' }),
        animate('1ms ease', style({ opacity: 1, height:'100%' }))
      ]),
      transition('* => void', [
        style({ opacity:1 }),
        animate('100ms ease', style({ opacity: 0, height:'0' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  isExpanded = false;
  constructor(private uiService: UIService) { }

  ngOnInit(): void {
    this.uiService.currentApprovalStageMessage.subscribe(
      res => {
        console.log("This is from sidebar - " + res)
      }
    )
  }

  expand(){
    this.isExpanded = !this.isExpanded;
  }

}
