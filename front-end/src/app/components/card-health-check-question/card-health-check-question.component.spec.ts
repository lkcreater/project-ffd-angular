import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHealthCheckQuestionComponent } from './card-health-check-question.component';

describe('CardHealthCheckQuestionComponent', () => {
  let component: CardHealthCheckQuestionComponent;
  let fixture: ComponentFixture<CardHealthCheckQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHealthCheckQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardHealthCheckQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
