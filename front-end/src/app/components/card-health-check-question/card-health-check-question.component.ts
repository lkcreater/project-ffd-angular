import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import {
  IQuestionAnswer,
  IRootQuestion,
} from '../../stores/questionnaire/questionnaire.reducer';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'app-card-health-check-question',
  standalone: true,
  imports: [],
  templateUrl: './card-health-check-question.component.html',
  styleUrl: './card-health-check-question.component.scss',
})
export class CardHealthCheckQuestionComponent {
  @Input({ required: true }) question!: IRootQuestion;
  @Output() onChange = new EventEmitter<{
    isValid: boolean;
    hcqId: number;
    hcqSubject: string;
    hcqType: string;
    answers: {
      ansId: number;
      ansScore: number;
      ansSubject: string;
    }[];
    total: number;
  }>();

  constructor(
    private notification: NzNotificationService,
    private uploadService: UploadService
  ) {}

  getUrl() {
    return this.uploadService.getUrl(this.question.hcqImage);
  }

  isValid: boolean = false;
  chooseChoice: IQuestionAnswer[] = [];

  actionSelect($event: any, answer: IQuestionAnswer) {
    const event = $event?.srcElement.classList as DOMTokenList;
    if (this.question.hcqOptions?.rule == 'oneChoice') {
      this.actionOneChoice(event, answer);
    }

    if (this.question.hcqOptions?.rule == 'multiChoice') {
      this.actionMultiChoice(event, answer);
    }
  }

  submit() {
    const ans: {
      ansId: number;
      ansScore: number;
      ansSubject: string;
    }[] = [];
    let total = 0;

    this.chooseChoice.forEach((choice) => {
      total += choice.ansScore;
      ans.push({
        ansId: choice.ansId,
        ansScore: choice.ansScore,
        ansSubject: choice.ansSubject,
      });
    });

    this.onChange.emit({
      isValid: this.isValid,
      hcqId: this.question.hcqId,
      hcqSubject: this.question.hcqSubject,
      hcqType: this.question.hcqType,
      answers: ans,
      total: total,
    });
  }

  actionOneChoice(event: DOMTokenList, answer: IQuestionAnswer) {
    if (event.contains('btn-white')) {
      if (this.chooseChoice.length > 0) {
        this._onWarnning('เลือกคำตอบได้ข้อเดียวเท่านั้น');
        return;
      }
      event.remove('btn-white');
      event.add('btn-primary');
      this.chooseChoice.push(answer);
      this.isValid = true;
    } else {
      event.remove('btn-primary');
      event.add('btn-white');
      this.chooseChoice = [];
      this.isValid = false;
    }

    this.submit();
  }

  actionMultiChoice(event: DOMTokenList, answer: IQuestionAnswer) {
    this.isValid = false;
    if (event.contains('btn-white')) {
      event.remove('btn-white');
      event.add('btn-primary');
      this.chooseChoice.push(answer);
    } else {
      event.remove('btn-primary');
      event.add('btn-white');
      _.remove(this.chooseChoice, (e) => {
        return e.ansId === answer.ansId;
      });
    }

    if (this.chooseChoice.length >= 1) {
      this.isValid = true;
    }

    this.submit();
  }

  _onWarnning(message: string) {
    this.notification.warning('แจ้งเตือน', message);
  }
}
