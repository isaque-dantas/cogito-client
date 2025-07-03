import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lessonTitle'
})
export class LessonTitlePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if (!Object.hasOwn(value, "position") && !Object.hasOwn(value, "title")) return value["title"];

    return `Aula ${value['position'] + 1} - ${value['title']}`;
  }

}
