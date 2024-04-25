import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let userInfoService: UserInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent, HttpClientModule, HttpClientTestingModule],
      providers: [
        UserInfoService,
        provideMockStore({ initialState: { isAuthenticated: false }}),
        // { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
