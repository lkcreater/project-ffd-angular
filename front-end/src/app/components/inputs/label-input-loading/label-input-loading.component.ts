import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-input-loading',
  standalone: true,
  imports: [],
  templateUrl: './label-input-loading.component.html',
})
export class LabelInputLoadingComponent {
  @Input({ required: true }) label!: string;
  @Input() isLoading: boolean = false;
  @Input() msg: string = 'กรุณารอสักครู่';
}
