import {CourseFormService} from './course-form-service';
import {FormBuilder} from '@angular/forms';

describe('CourseFormService', () => {
  let service: CourseFormService;

  beforeEach(() => {
    service = new CourseFormService(new FormBuilder());
  });

  it('#getVideoIdFromRawUrl should return ID for complete url', () => {
    const url = "https://www.youtube.com/watch?v=OIuG1bBkfs0"
    expect(service.getVideoIdFromRawUrl(url)).toBe('OIuG1bBkfs0');
  });

  it('#getVideoIdFromRawUrl should return ID for query parameter', () => {
    const url = "v=OIuG1bBkfs0"
    expect(service.getVideoIdFromRawUrl(url)).toBe('OIuG1bBkfs0');
  });

  it('#getVideoIdFromRawUrl should return null when there is no ID', () => {
    const url = "https://www.youtube.com/watch?v="
    expect(service.getVideoIdFromRawUrl(url)).toBe(null);
  });
});
