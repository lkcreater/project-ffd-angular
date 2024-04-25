import { Component, Input } from '@angular/core';

export type TModeType = 'dark' | 'light';
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  @Input({ required: true }) mode!: TModeType;
  @Input() width: number = 120;
  @Input() height: number = 100;

  getImageUrl() {
    let urlName: string = '';
    if (this.mode == 'dark') {
      urlName = 'assets/logo/logo-menu.svg';
    }
    if (this.mode == 'light') {
      urlName = 'assets/logo/logo-footer.svg';
    }
    return urlName;
  }
}
