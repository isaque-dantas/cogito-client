import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moduleTitle'
})
export class ModuleTitlePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if (value == undefined) return "Módulo"
    if (!Object.hasOwn(value, "position") && !Object.hasOwn(value, "title")) return value["title"];
    return `Módulo ${value['position'] + 1} - ${value['title']}`;
  }

}
