import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormatter',
  standalone: true
})
export class MoneyFormatterPipe implements PipeTransform {

  transform(value: number): string {
    let result = value.toString()
    return `${result[0]},${result.substring(1,4)} Ft`;
  }

}
