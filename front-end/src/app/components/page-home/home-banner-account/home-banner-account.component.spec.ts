import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBannerAccountComponent } from './home-banner-account.component';

describe('HomeBannerAccountComponent', () => {
  let component: HomeBannerAccountComponent;
  let fixture: ComponentFixture<HomeBannerAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBannerAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeBannerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
