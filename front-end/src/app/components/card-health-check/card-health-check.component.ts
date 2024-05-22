import { Component, OnInit } from '@angular/core';
import { CardHealthCheckQuestionComponent } from '../card-health-check-question/card-health-check-question.component';
import {
  NzNotificationService,
  NzNotificationModule,
} from 'ng-zorro-antd/notification';
import { CardHealthCheckConfirmComponent } from '../card-health-check-confirm/card-health-check-confirm.component';
import { CardContentComponent } from '../card-content/card-content.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { QuestionnaireService } from '../../services/questionnaire/questionnaire.service';
import { Router } from '@angular/router';
import {
  IResultQuestionnaire,
  IRootQuestion,
  IRuleResultQuestionnaire,
} from '../../stores/questionnaire/questionnaire.reducer';
import { UserInfoService } from '../../services/user-info/user-info.service';

@Component({
  selector: 'app-card-health-check',
  standalone: true,
  imports: [
    CardHealthCheckQuestionComponent,
    NzNotificationModule,
    CardHealthCheckConfirmComponent,
    CardContentComponent,
    ProgressBarComponent,
  ],
  templateUrl: './card-health-check.component.html',
  styleUrl: './card-health-check.component.scss',
})
export class CardHealthCheckComponent implements OnInit {
  constructor(
    private router: Router,
    private notification: NzNotificationService,
    private questionnaireService: QuestionnaireService,
    private userInfoService: UserInfoService
  ) {}

  imgBtnPrevUri: string = './assets/question/btn-arrow.png';

  countInitialQuestion: number = 0;
  dataStoreAll!: IResultQuestionnaire | null;
  questionInitail: IRootQuestion[] = [];
  questionGroup: IRootQuestion[] = [];
  isQuestionGroup: boolean = false;
  isFinish: boolean = false;
  isConfirm: boolean = false;
  questionAll: Record<string, IRootQuestion[]> | undefined = undefined;
  rules: IRuleResultQuestionnaire[] = [];
  countQuestion: number = 0;
  countQuestionInitial: number = 0;
  countAnswer: number = 0;
  index: number = 0;
  currentQuestionId: number = 0;
  answerQuestion: any = {};
  progress: number = 0;
  resultType: string = '';
  scoreInitail: number = 0;
  scoreGroup: number = 0;

  lockCheckPoint: boolean = false;
  indexCheckPoint: number = 0;
  isShowBtnNext: boolean = false;
  criticalScore: number = 0;

  ngOnInit(): void {
    this.questionnaireService.getQuestionnaire().subscribe((res) => {
      if (res.data == null) {
        this.router.navigate(['/']);
      }

      //-- set store data
      this.dataStoreAll = res.data ?? null;

      //-- set rule
      this.rules = res?.data?.rule ?? [];

      //-- set question all
      this.questionAll = res?.data?.questions;

      //-- set question initail
      res?.data?.CONFIG?.forEach((item) => {
        if (item.type == 'fixed') {
          const questions = res?.data?.questions[item.key] ?? null;
          if (questions) {
            this.questionInitail = [...this.questionInitail, ...questions];
          }
        } else {
          if (
            res?.data?.questions[item.key] &&
            res?.data?.questions[item.key]?.length > 0
          ) {
            this.countQuestion = res?.data?.questions[item.key]?.length;
          }
        }
      });

      //-- set count question
      this.countQuestionInitial = this.questionInitail?.length ?? 0;
      this.countQuestion = this.questionInitail?.length + this.countQuestion;

      //-- setup answer
      this.questionInitail.forEach((item, idx) => {
        this.answerQuestion[item.hcqId] = null;
      });
    });
  }

  getChooseChoice(object: any, idx: number) {
    this.index = idx;
    this.currentQuestionId = object.hcqId;
    if (object.isValid == true) {
      this.answerQuestion[object.hcqId] = object;
    } else {
      this.answerQuestion[object.hcqId] = null;
    }

    if(object.nextStep == true) {
      this.btnNextStep();
    }
  }

  btnNextStep() {
    const [question, answer] = this._findQuestionAndAnswer();

    if (!answer) {
      this.notification.error(
        'แจ้งเตือนจากระบบ',
        'กรุณาเลือกคำตอบของท่านก่อนที่จะกดย้อนกลับหรือถัดไป'
      );
      return;
    }

    if (answer.isValid == false) {
      this.notification.warning(
        'แจ้งเตือนจากระบบ',
        'กรุณาตรวจสอบคำตอบของท่านก่อนที่จะกดย้อนกลับหรือถัดไป'
      );
      return;
    }

    this.index++;
    this._calculateAnswer();

    //-- calculate check point
    if(this.lockCheckPoint == false && this.index == this.countQuestionInitial) {
      this.lockCheckPoint = true;
      this.indexCheckPoint = this.index;
    }

    //-- check hidden button next
    this._checkHiddenBtn();

    if (this.isQuestionGroup == false) {
      this._findGroupQuestion();
    } else {
      this._calculateQuestionFinal();
    }
  }

  btnPrevStep() {
    this._calculateAnswer();
    if(this.lockCheckPoint == false) {
      this.index--;
      this._checkHiddenBtn();
    } 
    else if(this.lockCheckPoint == true && this.index > this.indexCheckPoint) {
      this.index--;
      this._checkHiddenBtn();
    }else {
      this.notification.warning(
        'แจ้งเตือนจากระบบ',
        'ไม่สามารย้อนกลับได้ ระบบได้ทำการ check point คำถามของท่านแล้ว'
      );
    }
  }

  _checkHiddenBtn() {
    if(this.questionInitail[this.index]?.hcqOptions?.rule == 'multiChoice') {
      this.isShowBtnNext = true;
    }else {
      this.isShowBtnNext = false;
    }
  }

  _findQuestionAndAnswer() {
    const question = this.questionInitail[this.index];
    this.currentQuestionId = question?.hcqId;
    const answer = this.answerQuestion[this.currentQuestionId];

    return [question, answer];
  }

  _findGroupQuestion() {
    const countQuestion = this.questionInitail?.length ?? 0;

    if (this.countQuestionInitial == this.countAnswer) {
      let sumInitail = 0;
      let resultType;

      //-- summary score initial screen
      for (const [key, item] of Object.entries(this.answerQuestion)) {
        const object = item as {
          isValid: boolean;
          hcqType: string;
          total: number;
        };
        if (object?.isValid == true && object?.hcqType == 'INITIAL') {
          sumInitail += object?.total ?? 0;
        }
      }

      //-- convert score to 0
      const realScore = sumInitail;
      this.criticalScore = sumInitail < 0 ? sumInitail : 0;
      sumInitail = sumInitail < 0 ? 0 : sumInitail;

      //-- find questions for group
      this.rules.forEach((rule) => {
        if (
          rule?.hcqType == 'INITIAL' &&
          sumInitail >= rule?.hcrMin &&
          sumInitail <= rule?.hcrMax
        ) {
          resultType = rule?.hcrResult;
        }
      });

      //-- check has type questions
      if (resultType) {
        this.resultType = resultType;
        this.scoreInitail = realScore;
        this.questionGroup = this.questionAll
          ? this.questionAll[resultType]
          : [];

        this.isQuestionGroup = true;

        //-- set question for group
        this.questionInitail = [...this.questionInitail, ...this.questionGroup];

        //-- set answer for group
        this.questionGroup.forEach((item, idx) => {
          this.answerQuestion[item.hcqId] = null;
        });
      }
    }
  }

  _calculateQuestionFinal() {
    const countQuestion = this.questionInitail?.length ?? 0;

    if (countQuestion == this.countAnswer) {
      let sumScore = 0;

      //-- summary score by group
      for (const [key, item] of Object.entries(this.answerQuestion)) {
        const object = item as {
          isValid: boolean;
          hcqType: string;
          total: number;
        };
        if (object?.isValid == true && object?.hcqType == this.resultType) {
          sumScore += object?.total ?? 0;
        }
      }
      this.scoreGroup = sumScore + this.criticalScore;
      this.saveQuestion();
    }
  }

  _calculateAnswer() {
    let countAns = 0;
    for (const [key, item] of Object.entries(this.answerQuestion)) {
      if ((item as { isValid: boolean })?.isValid == true) {
        countAns++;
      }
    }
    this.countAnswer = countAns;

    this.calProgress();
  }

  saveQuestion() {
    const token = this.userInfoService.getToken();
    if (token) {
      this.questionnaireService
        .saveQuestionnaire(token, {
          hcHisSystem: this.dataStoreAll,
          hcHisAnswer: this.answerQuestion,
          hcTypeRule: this.resultType,
          hcScoreInitil: this.scoreInitail,
          hcHisScore: this.scoreGroup,
        })
        .subscribe((res) => {
          if (res) {
            this.isFinish = true;
          }
        });
    }
  }

  calProgress() {
    let current = this.countAnswer;
    const total = this.countQuestion || 0;

    this.progress = Number(((current * 100) / total).toFixed(0));
  }
}
