import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePointComponent } from './score-point.component';

describe('ScorePointComponent', () => {
  let component: ScorePointComponent;
  let fixture: ComponentFixture<ScorePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorePointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScorePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
