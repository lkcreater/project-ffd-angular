import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputConnectAccountComponent } from './input-connect-account.component';

describe('InputConnectAccountComponent', () => {
  let component: InputConnectAccountComponent;
  let fixture: ComponentFixture<InputConnectAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputConnectAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputConnectAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
