import { Component } from '@angular/core';
import { CardHealthCheckComponent } from '../../components/card-health-check/card-health-check.component';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [CardHealthCheckComponent],
  templateUrl: './health-check.component.html',
  styleUrl: './health-check.component.scss'
})
export class HealthCheckComponent {

}
