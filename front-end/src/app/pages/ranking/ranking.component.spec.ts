import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingComponent } from './ranking.component';
import { ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RankingComponent', () => {
  let component: RankingComponent;
  let fixture: ComponentFixture<RankingComponent>;
  let userInfoService: UserInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingComponent, HttpClientModule, HttpClientTestingModule],
      providers: [
        UserInfoService,
        provideMockStore({ initialState: { /* your initial state */ }}),
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RankingComponent);
    userInfoService = TestBed.inject(UserInfoService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
