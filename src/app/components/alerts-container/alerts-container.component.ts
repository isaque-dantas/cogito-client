import {Component} from '@angular/core';
import {Alert} from '../../interfaces/alert';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-alerts-container',
  imports: [],
  templateUrl: './alerts-container.component.html',
  styleUrl: './alerts-container.component.css'
})
export class AlertsContainerComponent {
  alerts: Alert[] = [];

  constructor(protected alertService: AlertService) {
    this.alertService.subscribe((alert: Alert) => this.alerts.push(alert))
    this.alertService.alertRemovedEmitter.subscribe((id: number) => this.removeAlert(id))
  }

  removeAlert(id: number) {
    this.alerts = this.alerts.filter(alert => alert.id !== id)
  }
}
