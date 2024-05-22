import { Component, OnInit } from '@angular/core';

import { ScoreExpComponent } from '../../score/score-exp/score-exp.component';
import { ScorePointComponent } from '../../score/score-point/score-point.component';
import { UserInfoService } from '../../../services/user-info/user-info.service';
import {
  IInfoProfile,
} from '../../../stores/user-info/user-info.actions';
import { UploadService } from '../../../services/upload/upload.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PersonaIconComponent } from '../../persona/persona-icon/persona-icon.component';

@Component({
  selector: 'app-home-banner-account',
  standalone: true,
  imports: [
    ScoreExpComponent, 
    ScorePointComponent, 
    NzIconModule,
    PersonaIconComponent
  ],
  templateUrl: './home-banner-account.component.html',
  styleUrl: './home-banner-account.component.scss',
})
export class HomeBannerAccountComponent implements OnInit {
  constructor(
    private userInfoService: UserInfoService,
    private uploadService: UploadService
  ) {}

  banner!: IInfoProfile;
  personaIcon!: string;
  
  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe((data) => {
      if (data && data.userInfo) {
        this.banner = data.userInfo;
        const linkUrl =
          this.uploadService.getUrl(data.userInfo?.peronaIcon?.iconImage) ?? '';
        this.personaIcon = linkUrl;
      }
    });
  }
}
