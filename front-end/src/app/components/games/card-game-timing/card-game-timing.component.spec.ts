import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGameTimingComponent } from './card-game-timing.component';

describe('CardGameTimingComponent', () => {
  let component: CardGameTimingComponent;
  let fixture: ComponentFixture<CardGameTimingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGameTimingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardGameTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
