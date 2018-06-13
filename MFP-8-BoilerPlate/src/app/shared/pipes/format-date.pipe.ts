import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const customDate = args;
    // console.log('FormatDatePipe : customDate : ' + customDate);
    return customDate < 10 ? '0' + customDate : customDate;
  }

}
