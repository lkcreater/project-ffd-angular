import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOtpVarifyComponent } from './card-otp-varify.component';

describe('CardOtpVarifyComponent', () => {
  let component: CardOtpVarifyComponent;
  let fixture: ComponentFixture<CardOtpVarifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOtpVarifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardOtpVarifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
