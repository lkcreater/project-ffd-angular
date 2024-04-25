import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRankingComponent } from './card-ranking.component';

describe('CardRankingComponent', () => {
  let component: CardRankingComponent;
  let fixture: ComponentFixture<CardRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
