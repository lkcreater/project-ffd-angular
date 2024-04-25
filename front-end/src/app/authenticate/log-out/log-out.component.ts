import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from '../../services/user-info/user-info.service';

@Component({
  selector: 'app-log-out',
  standalone: true,
  imports: [],
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.scss',
})
export class LogOutComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit(): void {
    this.logOut();
  }

  logOut() {
    if(this.userInfoService.logoutUserInfo()){
      this.router.navigate(['/'], { relativeTo: this.route });
    }
  }
}
