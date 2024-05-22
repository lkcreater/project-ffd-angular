import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [NzModalModule],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.scss',
})
export class HomeMenuComponent {
  @Input() label!: string;
  @Input() icon!: string;
  @Input() bgColor!: string;
  @Input() idName!: string;
  @Input() page!: string;

  constructor(private router: Router, private modal: NzModalService) {}

  goToPage() {
    if (['เกม','บทความทางการเงิน'].includes(this.label)) {
      this.router.navigate([this.page]);
    } else {
      this.info();
    }
  }

  info(): void {
    this.modal.info({
      nzTitle: 'Coming Soon...',

      nzOnOk: () => console.log('Info OK'),
    });
  }
}
