import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class LocaleServiceService {
  constructor() {
    this.setDefaultTimezone();
  }

  setDefaultTimezone() {
    moment.tz.setDefault('Etc/IST');
  }
}
