import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-alert',
  standalone: true,
  imports: [
    NzModalModule
  ],
  templateUrl: './modal-alert.component.html',
  styleUrl: './modal-alert.component.scss'
})
export class ModalAlertComponent {

  @Input() title: string = 'แจ้งเตือน';
  @Input() desc: string = 'เกิดข้อผิดพลาดบางอย่าง กรุณาตรวจสอบอีกครั้ง';
  @Input() btnLabel: string = 'ตกลง';
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  //-- image
  iconAlertDanger = './assets/icons/icon-alert-danger.png'

  handleAction() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
