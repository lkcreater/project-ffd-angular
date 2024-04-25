import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ContactService } from './contact.service';
import { JsonPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { IUserInfoData } from '../../stores/user-info/user-info.reducer';
import { CardContentComponent } from '../../components/card-content/card-content.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, NzButtonModule, JsonPipe, CardContentComponent, NzButtonModule,],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  public result: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private store: Store<{ userInfo: IUserInfoData }>
  ) {
    console.log(this.router.getCurrentNavigation()?.extras.state);

  }

  ngOnInit() {
    console.log('test api -> start');
    // this.route.data.subscribe(data =>{
    //   console.log('pass object -> ', data);
    // });
    this.contactService.getConnect().subscribe((data: any) => {
      console.log('connect api -> ', data);
    });

    // this.contactService.getConnectTest().subscribe((data: any) => {
    //   console.log('connect api IP -> ', data);
    // });
  }
}
