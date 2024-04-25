import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRegisterSuccessComponent } from './card-register-success.component';

describe('CardRegisterSuccessComponent', () => {
  let component: CardRegisterSuccessComponent;
  let fixture: ComponentFixture<CardRegisterSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRegisterSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardRegisterSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
