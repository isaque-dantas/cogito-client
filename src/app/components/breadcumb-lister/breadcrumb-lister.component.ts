import {Component, effect, inject, input, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Breadcrumb} from '../../interfaces/breadcrumb';

@Component({
  selector: 'app-breadcrumb-lister',
  imports: [
    RouterLink
  ],
  templateUrl: './breadcrumb-lister.component.html',
  styleUrl: './breadcrumb-lister.component.css'
})
export class BreadcrumbLister {
  activatedRoute = inject(ActivatedRoute);
  breadcrumbs = input<Breadcrumb[]>()
  currentUrl = signal<string>('')

  constructor() {
    effect(() => {
      this.activatedRoute.url.subscribe((data) => {
        console.log(data)
        this.currentUrl.set("/" + data.map(data => data.path).join('/'))
      })
    })
  }
}
