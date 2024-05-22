import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ILineProviderEnv } from '../../core/interfaces';

@Component({
  selector: 'app-btn-line-login',
  standalone: true,
  imports: [NzButtonModule, CommonModule],
  templateUrl: './btn-line-login.component.html',
  styleUrl: './btn-line-login.component.scss',
})
export class BtnLineLoginComponent {
  @Input() prefix: string = 'เข้าสู่ระบบด้วย ';
  @Input({ required: true }) line!: ILineProviderEnv;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notification: NzNotificationService
  ) {}

  private _urlAuthLine: string = 'https://access.line.me/oauth2/v2.1/authorize';

  urlLoginLine() {
    if (this.line) {
      const urlCallBack = decodeURIComponent(this.line.pathCallback);
      let url = new URL(this._urlAuthLine);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('client_id', this.line.clientId);
      url.searchParams.set('redirect_uri', urlCallBack);
      url.searchParams.set('state', `${this.line.state}@LINE`);
      url.searchParams.set('scope', ['profile', 'openid'].join(' '));
      url.searchParams.set('disable_auto_login', 'false');

      if (isPlatformBrowser(this.platformId)) {
        window.location.href = url.toString();
      }
      return true;
    }

    this.notification.error(
      'ไม่พบ line provider',
      'กรุณาตรวจสอบ line provider!'
    );
    return false;
  }
}
