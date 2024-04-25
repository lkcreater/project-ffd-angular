import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExplainComponent } from './card-explain.component';

describe('CardExplainComponent', () => {
  let component: CardExplainComponent;
  let fixture: ComponentFixture<CardExplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardExplainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardExplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
