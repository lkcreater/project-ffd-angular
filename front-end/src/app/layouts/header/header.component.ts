import { Component, Input } from '@angular/core';
import { NzHeaderComponent, NzLayoutModule } from 'ng-zorro-antd/layout';
import { LogoComponent } from '../../components/logo/logo.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { NzMenuItemComponent, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieHelper } from '../../helpers/cookie.helper';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzHeaderComponent,
    NzLayoutModule,
    NzMenuModule,
    NzMenuItemComponent,
    NzDrawerModule,
    LogoComponent,
    MenuComponent,
    RouterLink,
    NgIf,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  
  @Input() hiddenMenu: boolean = false;
  @Input() marginBottom: boolean = true;
  @Input() hiddenHeaderScore: boolean = false;

  isCollapsed = false;
  stateShow = false;

  constructor(private cookieService: CookieService) {}
  ngOnInit(): void {
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
