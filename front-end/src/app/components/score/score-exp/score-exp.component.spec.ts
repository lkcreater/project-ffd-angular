import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreExpComponent } from './score-exp.component';

describe('ScoreExpComponent', () => {
  let component: ScoreExpComponent;
  let fixture: ComponentFixture<ScoreExpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreExpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
