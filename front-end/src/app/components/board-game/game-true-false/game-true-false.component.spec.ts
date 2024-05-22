import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTrueFalseComponent } from './game-true-false.component';

describe('GameTrueFalseComponent', () => {
  let component: GameTrueFalseComponent;
  let fixture: ComponentFixture<GameTrueFalseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTrueFalseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameTrueFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
