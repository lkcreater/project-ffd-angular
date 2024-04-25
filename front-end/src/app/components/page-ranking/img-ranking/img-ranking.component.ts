import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-ranking',
  standalone: true,
  imports: [],
  templateUrl: './img-ranking.component.html',
  styleUrl: './img-ranking.component.scss',
})
export class ImgRankingComponent {
  @Input({ required: true }) src!: string;
  @Input() size: string = '120px';
}
