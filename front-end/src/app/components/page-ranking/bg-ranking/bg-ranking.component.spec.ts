import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgRankingComponent } from './bg-ranking.component';

describe('BgRankingComponent', () => {
  let component: BgRankingComponent;
  let fixture: ComponentFixture<BgRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BgRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
