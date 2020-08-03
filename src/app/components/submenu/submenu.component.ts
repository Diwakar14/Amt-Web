import { trigger, transition, animate, style, state } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
  animations:[
    trigger('faddingIn', [
      state('opened', style({opacity:1, height:'*', marginTop:'0.5rem', overflow:'visible'})),
      state('closed', style({opacity:0, height:'0', marginTop: 0, overflow:'hidden'})),
      
      transition('closed <=> opened', [
        animate('300ms ease-in-out')
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