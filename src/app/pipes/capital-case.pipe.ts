import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalCase'
})
export class CapitalCasePipe implements PipeTransform {

  // Per trasformare in maiuscolo la prima lettera di una parola
  transform(value: any): string {
    if(!value) return '';

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
