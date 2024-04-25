import { Pipe, PipeTransform } from '@angular/core';
import * as mo from 'moment-timezone';

@Pipe({
  name: 'dateTh',
  standalone: true
})
export class DateThPipe implements PipeTransform {

  keyTimezone: string = 'Asia/Bangkok';

  transform(value: string, key: 'S' | 'L'): unknown {
    const dateTxt = new Date(value);
    const resultDateTz = mo.tz(dateTxt, this.keyTimezone).format('YYYY-MM-DD');
    return resultDateTz;
  }

}
