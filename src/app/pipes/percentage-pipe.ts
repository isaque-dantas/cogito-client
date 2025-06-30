import {Pipe, PipeTransform} from '@angular/core';

const PERCENTAGE_DIVISION_FACTOR: number = 100
const TWO_DECIMAL_DIGITS: number = 2

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(value: unknown, ..._: unknown[]): string | null {
    let num: number = 0;

    try {
      num = Number(value);
    } catch (e) {
      return null;
    }

    return (Math.round(num * 100 * PERCENTAGE_DIVISION_FACTOR) / PERCENTAGE_DIVISION_FACTOR).toFixed(TWO_DECIMAL_DIGITS) + "%"
  }

}
