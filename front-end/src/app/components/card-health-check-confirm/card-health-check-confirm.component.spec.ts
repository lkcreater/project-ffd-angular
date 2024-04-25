import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHealthCheckConfirmComponent } from './card-health-check-confirm.component';

describe('CardHealthCheckConfirmComponent', () => {
  let component: CardHealthCheckConfirmComponent;
  let fixture: ComponentFixture<CardHealthCheckConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHealthCheckConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardHealthCheckConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
