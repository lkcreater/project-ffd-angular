import { Component, Input, OnInit } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ImgRankingComponent } from '../img-ranking/img-ranking.component';

@Component({
  selector: 'app-card-ranking',
  standalone: true,
  imports: [NzIconModule, ImgRankingComponent],
  templateUrl: './card-ranking.component.html',
  styleUrl: './card-ranking.component.scss',
})
export class CardRankingComponent implements OnInit {
  @Input({ required: true }) rank!: string;
  @Input({ required: true }) size!: string;
  @Input({ required: true }) src!: string;

  userName!: string;
  point!: string;
  colorRanking!: string;
  iconName!: string;
  sizeIcon: string = '24px';

  ngOnInit(): void {
    if (this.rank == '1') {
      this.iconName = 'crown';
      this.colorRanking = '#005DA5';
      this.sizeIcon = '42px';
    }
    if (this.rank == '2') {
      this.iconName = 'caret-up';
      this.colorRanking = '#FFC107';
    }
    if (this.rank == '3') {
      this.iconName = 'caret-down';
      this.colorRanking = '#E21F26';
    }
  }
}
