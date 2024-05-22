import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IAnswer } from '../../../stores/game/game.reducer';
import { UploadService } from '../../../services/upload/upload.service';

@Component({
  selector: 'app-card-board-game',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './card-board-game.component.html',
  styleUrl: './card-board-game.component.scss',
})
export class CardBoardGameComponent {
  @Input({ required: true }) answer!: IAnswer;
  @Input() disabled: boolean = false;
  @Output() onChoose = new EventEmitter();

  imageIsTrue = './assets/games/game-is-true.png'
  imageIsFalse = './assets/games/game-is-false.png'

  constructor(
    private uploadService: UploadService
  ) {}

  isSelected: boolean = false;
  actionChoose() {
    if(this.disabled == false) {
      this.isSelected = true;
      this.onChoose.emit(this.answer);
    }
  }

  getUrlImage() {
    return this.uploadService.getUrl(this.answer.gmAnsChoice?.image);
  }
}
