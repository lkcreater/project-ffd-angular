import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-matching-game',
  standalone: true,
  imports: [],
  templateUrl: './card-matching-game.component.html',
  styleUrl: './card-matching-game.component.scss'
})
export class CardMatchingGameComponent {
  @Input() index!: number;
  @Input() disabled: boolean = false;
  @Output() onOpen = new EventEmitter();

  isOpen = false;

  actionOpen() {
    if(this.disabled == false) {
      this.isOpen = true;
      this.onOpen.emit(this.index);
    }
  }
}
