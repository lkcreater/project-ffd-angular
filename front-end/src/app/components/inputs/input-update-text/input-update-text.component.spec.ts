import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputUpdateTextComponent } from './input-update-text.component';

describe('InputUpdateTextComponent', () => {
  let component: InputUpdateTextComponent;
  let fixture: ComponentFixture<InputUpdateTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputUpdateTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputUpdateTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
