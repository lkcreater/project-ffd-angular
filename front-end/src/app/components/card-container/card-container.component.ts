import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-card-container',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss'
})
export class CardContainerComponent {
  @Input() isHiddenHeader = false;
}
