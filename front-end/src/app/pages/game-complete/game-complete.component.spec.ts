import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCompleteComponent } from './game-complete.component';

describe('GameCompleteComponent', () => {
  let component: GameCompleteComponent;
  let fixture: ComponentFixture<GameCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
