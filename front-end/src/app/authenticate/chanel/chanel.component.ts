import { Component, OnDestroy, OnInit } from '@angular/core';
import { LineService } from '../../services/line/line.service';
import { Router, RouterLink } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { BtnLineLoginComponent } from '../../components/btn-line-login/btn-line-login.component';
import { DrawerTermConditionComponent, IContentDrawer } from '../../components/drawer-term-condition/drawer-term-condition.component';
import { TermConditionService } from '../../services/term-condition/term-condition.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { ILineProviderEnv, TChanelAuthen } from '../../core/interfaces';

@Component({
  selector: 'app-chanel',
  standalone: true,
  imports: [
    RouterLink,
    CardContentComponent,
    BtnLineLoginComponent
  ],
  templateUrl: './chanel.component.html',
  styleUrl: './chanel.component.scss'
})
export class ChanelComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private drawerService: NzDrawerService,
    private lineService: LineService,
    private termConditionService: TermConditionService,
  ) {}

  lineProvider: ILineProviderEnv[] = [];
  drawerRef: Subscription | null = null;

  ngOnInit(): void {
    this.lineService.getLineChanels().subscribe(res => {
      this.lineProvider = res
    });
  }

  ngOnDestroy(): void {
    if(this.drawerRef) {
      this.drawerRef.unsubscribe();
    }
  }

  async registerTerms(type: TChanelAuthen) {
    //-- get store terms
    const { data } = await firstValueFrom(this.termConditionService.getTermCondition());

    if(data) {
      this.drawerTermCondition({
        value: 0,
        title: data.condiTopic,
        desc: data.condiText,
        notice: data.condiPrivacyNotice,
        version: data.condiVersion,
        btnAccept: data.condiOption[0]?.option ?? 1,
        btnReject: data.condiOption[1]?.option ?? 2,
      }, type)
    }else{
      this.gotoSignup(type);
    }
  }

  drawerTermCondition(dataDrawer: IContentDrawer, type: TChanelAuthen) {
    const drawerRef = this.drawerService.create<
      DrawerTermConditionComponent,
      IContentDrawer
    >({
      nzClosable: false,
      nzWidth: '100%',
      nzHeight: '100%',
      nzPlacement: 'bottom',
      nzWrapClassName: 'app-drawer-term',
      nzContent: DrawerTermConditionComponent,
      nzData: dataDrawer,
    });

    this.drawerRef = drawerRef.afterClose.subscribe((data) => {
      if(data.value == 1) {
        this.gotoSignup(type, {
          condiVersion: data.version,
          option: data.value
        });
      }
    });
  }

  gotoSignup(type: TChanelAuthen, state: { condiVersion: string, option: number } | null = null) {
    this.router.navigate(['/auth/sign-up'], { state: { term: state, type } });
  }
}
