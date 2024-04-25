import { Component } from '@angular/core';
import { ImgRankingComponent } from '../img-ranking/img-ranking.component';

@Component({
  selector: 'app-table-ranking',
  standalone: true,
  imports: [ImgRankingComponent],
  templateUrl: './table-ranking.component.html',
  styleUrl: './table-ranking.component.scss',
})
export class TableRankingComponent {}
