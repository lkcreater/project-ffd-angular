import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-explain',
  standalone: true,
  imports: [],
  templateUrl: './card-explain.component.html',
  styleUrl: './card-explain.component.scss'
})
export class CardExplainComponent {
  @Input() title!: string;
  @Input() explain!: string;
}
