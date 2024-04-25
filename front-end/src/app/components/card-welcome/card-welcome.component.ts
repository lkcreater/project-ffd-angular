import { Component } from '@angular/core';
import { CardContainerComponent } from '../card-container/card-container.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-welcome',
  standalone: true,
  imports: [CardContainerComponent, RouterLink],
  templateUrl: './card-welcome.component.html',
  styleUrl: './card-welcome.component.scss'
})
export class CardWelcomeComponent {
  imgSrc = './assets/logo/welcome-home.png';
}
