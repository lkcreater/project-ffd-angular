import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.scss',
})
export class HomeMenuComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Input() bgColor!: string;
  @Input() idName!: string;
}
