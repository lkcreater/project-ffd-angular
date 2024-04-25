import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBoardGameComponent } from './card-board-game.component';

describe('CardBoardGameComponent', () => {
  let component: CardBoardGameComponent;
  let fixture: ComponentFixture<CardBoardGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBoardGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardBoardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
