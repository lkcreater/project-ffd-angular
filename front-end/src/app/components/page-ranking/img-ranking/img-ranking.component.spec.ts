import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgRankingComponent } from './img-ranking.component';

describe('ImgRankingComponent', () => {
  let component: ImgRankingComponent;
  let fixture: ComponentFixture<ImgRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImgRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
