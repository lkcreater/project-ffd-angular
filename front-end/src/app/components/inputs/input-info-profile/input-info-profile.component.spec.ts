import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputInfoProfileComponent } from './input-info-profile.component';

describe('InputInfoProfileComponent', () => {
  let component: InputInfoProfileComponent;
  let fixture: ComponentFixture<InputInfoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputInfoProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputInfoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
