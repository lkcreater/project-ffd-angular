import { Component, OnInit } from '@angular/core';
import { CardContentComponent } from '../card-content/card-content.component';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { IUserInfoData } from '../../stores/user-info/user-info.reducer';
import { IInfoProfile } from '../../stores/user-info/user-info.actions';
import { RouterLink } from '@angular/router';
import { QuestionnaireService } from '../../services/questionnaire/questionnaire.service';

@Component({
  selector: 'app-card-register-success',
  standalone: true,
  imports: [
    RouterLink,
    CardContentComponent
  ],
  templateUrl: './card-register-success.component.html',
  styleUrl: './card-register-success.component.scss'
})
export class CardRegisterSuccessComponent implements OnInit {
 
  constructor(
    private userInfoService: UserInfoService,
    private questionnaireService: QuestionnaireService
  ) {}

  //-- link image
  imageWelcome = './assets/persona/welcome-success.png' 
  imageHcTitle = './assets/question/welcom-hc-title.png'
  imageHcIcon = './assets/question/welcom-hc-icon.png'
  textDetail = 'ให้ Freedom by TISCO ช่วยคุณหาคำตอบ กับแพลตฟอร์มที่จะช่วยให้คุณรู้จักตัวเอง';

  userInfo!: IUserInfoData<IInfoProfile>;
  account!: IInfoProfile;

  ngOnInit() {
    this.userInfoService.getUserInfo().subscribe((res) => {
      this.userInfo = res;
      this.account = res.userInfo;
    });

    const token = this.userInfoService.getToken();
    if(token) {
      this.questionnaireService.fetchQuestionnaireToStrore(token).subscribe(ques => {
        
      });
    }
  }

}
