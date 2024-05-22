import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../../services/user-info/user-info.service';
import { UploadService } from '../../../services/upload/upload.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PersonaResultComponent } from '../persona-result/persona-result.component';
import { IPeronaIcon } from '../../../stores/user-info/user-info.actions';

@Component({
  selector: 'app-persona-icon',
  standalone: true,
  imports: [
    NzIconModule,
    NzModalModule,
    PersonaResultComponent
  ],
  templateUrl: './persona-icon.component.html',
  styleUrl: './persona-icon.component.scss'
})
export class PersonaIconComponent implements OnInit {

  constructor(
    private userInfoService: UserInfoService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe((data) => {
      if (data && data.userInfo) {
        const linkUrl =
          this.uploadService.getUrl(data.userInfo?.peronaIcon?.iconImage) ?? '';
        this.personaIcon = linkUrl;
        this.persona = data.userInfo.peronaIcon;
      }
    });
  }

  personaIcon!: string;
  persona!: IPeronaIcon;
  isVisible = false;

  openModal() {
    this.isVisible = true;
  }
  
  handleCancel() {
    this.isVisible = false;
  }
}
