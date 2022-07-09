import { LocaleServiceService } from './services/locale-service.service';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Ace My Tax';
  constructor(private local: LocaleServiceService){
    
  }
  ngAfterViewInit(): void {
    this.local.setDefaultTimezone();
  }
  
}
