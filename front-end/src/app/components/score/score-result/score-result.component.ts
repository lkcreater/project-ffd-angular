import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-result',
  standalone: true,
  imports: [],
  templateUrl: './score-result.component.html',
  styleUrl: './score-result.component.scss'
})
export class ScoreResultComponent {
  @Input({ required: true }) score!: number;
  @Input({ required: true }) total!: number;
}
