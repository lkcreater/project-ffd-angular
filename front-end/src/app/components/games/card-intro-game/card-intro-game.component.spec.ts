import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIntroGameComponent } from './card-intro-game.component';

describe('CardIntroGameComponent', () => {
  let component: CardIntroGameComponent;
  let fixture: ComponentFixture<CardIntroGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardIntroGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardIntroGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
