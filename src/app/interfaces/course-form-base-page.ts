import {CourseForm} from './course';
import {HttpErrorResponse} from '@angular/common/http';

export interface CourseFormBasePageInterface {
  sendFormToServer(courseForm: CourseForm): void;
  handleFormError(error: HttpErrorResponse): void;
}
