import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NzFooterComponent, NzLayoutModule } from 'ng-zorro-antd/layout';
import { LogoComponent } from '../../components/logo/logo.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzLayoutModule, NzFooterComponent, LogoComponent, MenuComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
