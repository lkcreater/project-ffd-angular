import { Component, OnInit } from '@angular/core';
import { GameResultComponent } from '../../components/games/game-result/game-result.component';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserInfoService } from '../../services/user-info/user-info.service';

export interface IGameCompleteResult {
  respone: any,
  result: {
    score: number;
    time: number;
    total: number;
  }
}

@Component({
  selector: 'app-game-complete',
  standalone: true,
  imports: [
    GameResultComponent
  ],
  templateUrl: './game-complete.component.html',
  styleUrl: './game-complete.component.scss'
})
export class GameCompleteComponent implements OnInit {
  constructor(
    private router: Router,
    private notification: NzNotificationService,
    private userInfoService: UserInfoService,
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state as IGameCompleteResult
    if(state) {
      this.stateObject = state;
    }else {
      this.notification.warning('แจ้งเตือน', 'ไม่พบข้อมูลที่ท่านต้องการ');
      this.router.navigate(['/game']);
    }
  }

  ngOnInit(): void {
    this.userInfoService.fetchUserInfo().subscribe();
  }

  stateObject!: IGameCompleteResult;

}
