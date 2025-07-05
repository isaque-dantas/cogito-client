import {Component, effect, Input, input, output} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-search-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-form.html',
  styleUrl: 'search-form.css'
})
export class SearchForm {
  courseSearchFormControl = new FormControl('', Validators.required)

  searchQuery = input('')
  size = input('md')
  searchQueryChanged = output<string>()

  constructor() {
    effect(() => {
      this.courseSearchFormControl.setValue(this.searchQuery())
    })
  }

  updateSearchQuery() {
    const searchQuery = this.courseSearchFormControl.value ?? ""
    this.searchQueryChanged.emit(searchQuery)
  }

  handleInputKeyDown(event: KeyboardEvent) {
    if (event.key == "Enter") this.updateSearchQuery()
  }
}
