import { Component, Input } from '@angular/core';
import { CardContainerComponent } from '../card-container/card-container.component';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CardContainerComponent, HeaderComponent],
  templateUrl: './card-content.component.html',
  styleUrl: './card-content.component.scss',
})
export class CardContentComponent {
  @Input() hiddenMenu: boolean = false;
  @Input() hiddenHeader: boolean = false;
  @Input() hiddenHeaderScore: boolean = false;
}
