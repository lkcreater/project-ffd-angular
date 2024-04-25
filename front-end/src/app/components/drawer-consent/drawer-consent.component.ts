import { Component, Inject } from '@angular/core';
import {
  NzDrawerRef,
  NzDrawerModule,
  NZ_DRAWER_DATA,
} from 'ng-zorro-antd/drawer';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';

export interface IContentDrawerConsent {
  value: number;
  title: string;
  desc: string;
  version: string;
  notice?: string;
  code: string;
  codeConsent?: string;
  btnAccept: number;
  btnReject: number;
}

@Component({
  selector: 'app-drawer-consent',
  standalone: true,
  imports: [NzDrawerModule, NzCheckboxModule, FormsModule],
  templateUrl: './drawer-consent.component.html',
  styleUrl: './drawer-consent.component.scss',
})
export class DrawerConsentComponent {
  checked = false;

  constructor(
    @Inject(NZ_DRAWER_DATA) public nzData: IContentDrawerConsent,
    private drawerRef: NzDrawerRef<string>
  ) {}


  actionAccept() {
    this.actionNextSubmit(this.nzData.btnAccept);
  }

  actionReject() {
    this.actionNextSubmit(this.nzData.btnReject);
  }

  actionNextSubmit(val: number) {
    this.nzData.value = val;
    this.drawerRef.close(this.nzData);
  }
}
