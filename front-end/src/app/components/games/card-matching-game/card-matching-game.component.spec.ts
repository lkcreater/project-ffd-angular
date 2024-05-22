import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMatchingGameComponent } from './card-matching-game.component';

describe('CardMatchingGameComponent', () => {
  let component: CardMatchingGameComponent;
  let fixture: ComponentFixture<CardMatchingGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMatchingGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMatchingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
