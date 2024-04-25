import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSuccessComponent } from './question-success.component';

describe('QuestionSuccessComponent', () => {
  let component: QuestionSuccessComponent;
  let fixture: ComponentFixture<QuestionSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
