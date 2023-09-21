import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: any, currencySymbol: string = '¥', decimalDigits: number = 2): string {
    if (!value) {
      return '';
    }
    return currencySymbol + parseFloat(value).toFixed(decimalDigits);
  }
}
