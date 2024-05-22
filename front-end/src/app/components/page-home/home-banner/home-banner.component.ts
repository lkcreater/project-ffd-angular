import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss',
})
export class HomeBannerComponent {
  constructor(private modal: NzModalService) {}
  info(): void {
    this.modal.info({
      nzTitle: 'Coming Soon...',

      nzOnOk: () => console.log('Info OK'),
    });
  }
}
