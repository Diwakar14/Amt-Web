import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToist'
})
export class DatetimeFormaterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let utcDate =  value + ' UTC';
    return utcDate;
  }

}
