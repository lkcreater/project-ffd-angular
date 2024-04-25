import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputChangeProfileComponent } from './input-change-profile.component';

describe('ChangeProfileComponent', () => {
  let component: InputChangeProfileComponent;
  let fixture: ComponentFixture<InputChangeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputChangeProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
