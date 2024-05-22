import { Component, OnInit } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserInfoService } from '../../../services/user-info/user-info.service';
import { IRankingScoreMe } from '../../../stores/user-info/user-info.actions';

@Component({
  selector: 'app-score-point',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './score-point.component.html',
  styleUrl: './score-point.component.scss',
})
export class ScorePointComponent implements OnInit {

  constructor(private userInfoService: UserInfoService) {}

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe((result) => {
      if (result?.isAuthenticated == true) {
        this.scoreMe = result.userInfo?.rankHistory;
      }
    });
  }

  scoreMe!: IRankingScoreMe | null;

  getScore() {
    if(this.scoreMe?.rankScore) {
      return this.scoreMe?.rankScore;
    }
    return 0;
  }
}
