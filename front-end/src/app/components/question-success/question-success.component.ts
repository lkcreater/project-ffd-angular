import { Component } from '@angular/core';
import { CardContentComponent } from '../card-content/card-content.component';

@Component({
  selector: 'app-question-success',
  standalone: true,
  imports: [CardContentComponent],
  templateUrl: './question-success.component.html',
  styleUrl: './question-success.component.scss',
})
export class QuestionSuccessComponent {}
