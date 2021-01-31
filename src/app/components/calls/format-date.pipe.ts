import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

  transform(value: number): string {
    return moment(value).format('HH:mm:ss');
  }

}
