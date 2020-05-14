import { SubmenuComponent } from './../submenu/submenu.component';
import { Component, ContentChildren, QueryList, AfterViewInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterContentInit {
  
  @ContentChildren(SubmenuComponent) submenu: QueryList<SubmenuComponent>;
 
  ngAfterContentInit() {
    // Open the first panel
    this.submenu.toArray()[0].opened = true;
    // Loop through all submenu
    this.submenu.toArray().forEach((panel) => {
      // subscribe panel toggle event
      panel.toggle.subscribe(() => {
        // Open the panel
        this.openPanel(panel);
      });
    });
  }
 
  openPanel(panel: SubmenuComponent) {
    // close all submenu
    this.submenu.toArray().forEach(p => p.opened = false);
    // open the selected panel
    panel.opened = true;
  }

}
