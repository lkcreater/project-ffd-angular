import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import {
  NzDrawerRef,
  NzDrawerModule,
  NZ_DRAWER_DATA,
} from 'ng-zorro-antd/drawer';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layouts/header/header.component';

export interface IContentDrawer {
  value: number;
  title: string;
  desc: string;
  version: string;
  notice: string;
  codeConsent?: string;
  btnAccept: number;
  btnReject: number;
}

@Component({
  selector: 'app-drawer-term-condition',
  standalone: true,
  imports: [NzDrawerModule, NzCheckboxModule, FormsModule, HeaderComponent],
  templateUrl: './drawer-term-condition.component.html',
  styleUrl: './drawer-term-condition.component.scss',
})
export class DrawerTermConditionComponent implements AfterViewInit {

  @ViewChild('contentRef') contentRef!: ElementRef;
  @ViewChild('overflowRef') overflowRef!: ElementRef;

  constructor(
    @Inject(NZ_DRAWER_DATA) public nzData: IContentDrawer,
    private drawerRef: NzDrawerRef<string>
  ) {}

  isCheckScoll: boolean = false;
  disableBtn: boolean = true;
  checked = false;

  ngAfterViewInit(): void {
    if(this.overflowRef.nativeElement.clientHeight >= this.contentRef?.nativeElement.clientHeight) {
      this.isCheckScoll = true;
      this.disableBtn = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onElementScroll() {
    if(!this.isCheckScoll) {
      const divScoll = this.overflowRef.nativeElement.scrollTop + this.overflowRef.nativeElement.clientHeight;
      if(divScoll >= this.contentRef?.nativeElement.clientHeight) {
        this.isCheckScoll = true;
        this.disableBtn = false;
      }
    }
  }

  actionAccept(val: number) {
    this.nzData.value = val;
    this.drawerRef.close(this.nzData);
  }

  actionNextSubmit() {
    this.nzData.value = this.checked
      ? this.nzData.btnAccept
      : this.nzData.btnReject;
    this.drawerRef.close(this.nzData);
  }
}
