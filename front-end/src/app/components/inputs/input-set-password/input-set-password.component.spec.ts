import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSetPasswordComponent } from './input-set-password.component';

describe('InputSetPasswordComponent', () => {
  let component: InputSetPasswordComponent;
  let fixture: ComponentFixture<InputSetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSetPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputSetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
