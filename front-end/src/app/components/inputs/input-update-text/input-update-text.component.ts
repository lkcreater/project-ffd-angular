import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-input-update-text',
  standalone: true,
  imports: [
    NzIconModule,
    NzInputModule,
    FormsModule
  ],
  templateUrl: './input-update-text.component.html',
  styleUrl: './input-update-text.component.scss'
})
export class InputUpdateTextComponent {
  @Input({ required: true }) input!: string;
  @Input({ required: true }) inputName!: string;
  @Input() label: string = '';
  @Output() onChange = new EventEmitter<{
    inputName: string;
    input: string;
  }>();

  constructor() {}

  isEditable: boolean = false;

  saveUpdate() {
    this.isEditable = !this.isEditable;
    this.onChange.emit({
      inputName: this.inputName,
      input: this.input
    });
  }
}
