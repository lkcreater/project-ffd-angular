import { Component, OnInit } from '@angular/core';
import { CardContentComponent } from '../card-content/card-content.component';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { PersonaResultComponent } from '../persona/persona-result/persona-result.component';
import { IPeronaIcon } from '../../stores/user-info/user-info.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-health-check-confirm',
  standalone: true,
  imports: [CardContentComponent, PersonaResultComponent],
  templateUrl: './card-health-check-confirm.component.html',
  styleUrl: './card-health-check-confirm.component.scss',
})
export class CardHealthCheckConfirmComponent implements OnInit {
  
  constructor(
    private router: Router,
    private userInfoService: UserInfoService
  ) {}

  personal!: IPeronaIcon;
  isDisplayPersonal: boolean = false;
  image = './assets/question/success.png';

  ngOnInit(): void {
    this.userInfoService.fetchUserInfo().subscribe((res) => {
      if (res?.peronaIcon) {
        this.personal = res?.peronaIcon;
        setTimeout(() => {
          this.isDisplayPersonal = true;
        }, 2000);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
