import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AlertsContainerComponent} from './components/alerts-container/alerts-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertsContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'cogito-client-20';
}
