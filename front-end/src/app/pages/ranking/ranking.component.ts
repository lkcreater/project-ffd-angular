import { Component } from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { CardRankingComponent } from '../../components/page-ranking/card-ranking/card-ranking.component';
import { TableRankingComponent } from '../../components/page-ranking/table-ranking/table-ranking.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BgRankingComponent } from '../../components/page-ranking/bg-ranking/bg-ranking.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    NzInputModule,
    CommonModule,
    NzIconModule,
    CardContentComponent,
    CardRankingComponent,
    TableRankingComponent,
    BgRankingComponent,
  ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent {}
