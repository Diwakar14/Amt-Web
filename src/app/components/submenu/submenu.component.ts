import { trigger, transition, animate, style } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
  animations:[
    trigger('faddingIn', [
      transition('void => *', [
        style({opacity:0, height:'*'}),
        animate('800ms ease', style({opacity:1, height:'100%'}))
      ]),
      transition('* => void', [
        style({opacity:1, height:'*'}),
        animate('600ms ease', style({opacity:0, height:'0'}))
      ])
    ])
  ]
})
export class SubmenuComponent {
  @Input() opened = false;
  @Input() title: string;
  @Input() logo: string;
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

}
