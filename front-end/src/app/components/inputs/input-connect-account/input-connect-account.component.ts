import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TChanelAuthen } from '../../../core/interfaces';
import { IChannelConnectAccount } from '../../../pages/profile/profile.component';
import { TextHelper } from '../../../helpers/text.helper';

interface IObjectConnect {
  source: string;
  classImage: string[];
  classButton: string[];
}

@Component({
  selector: 'app-input-connect-account',
  standalone: true,
  imports: [
    NzIconModule,
    NzInputModule,
    NzPopconfirmModule
  ],
  templateUrl: './input-connect-account.component.html',
  styleUrl: './input-connect-account.component.scss'
})
export class InputConnectAccountComponent implements OnInit  {
  @Input() index: number = 0;
  @Input({ required: true }) type!: TChanelAuthen;
  @Input({ required: true }) data!: IChannelConnectAccount;
  @Output() onAction = new EventEmitter<IChannelConnectAccount>();

  constructor() {}

  labelConnect: boolean = false;
  connect: Record<TChanelAuthen, IObjectConnect> = {
    EMAIL: { 
      source: './assets/icons/icon-email.svg',
      classImage: ['h-[15px]'],
      classButton: ['btn-app', 'btn-outline']
    },
    PHONE: { 
      source: './assets/icons/icon-phone.svg',
      classImage: ['h-[20px]'],
      classButton: ['btn-app', 'btn-outline']
    },
    LINE: { 
      source: './assets/icons/icon-line.svg',
      classImage: ['h-[15px]'],
      classButton: ['btn-app', 'btn-line']
    }
  }

  ngOnInit(): void {

  }

  labelAccount() {
    let label = '';
    if(this.data.type == 'EMAIL') {
      label = TextHelper.maskInput('EMAIL', this.data.loginData);
    }

    if(this.data.type == 'PHONE') {
      label = TextHelper.maskInput('PHONE', this.data.loginData);
    }

    if(this.data.type == 'LINE') {
      label = this.data.lineProvide?.name ?? ''
    }

    return label;
  }

  labelButton() {

    this.data.type
  }

  actionAccount() {
    this.onAction.emit(this.data)
  }
}
