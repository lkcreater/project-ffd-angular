import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLineLoginComponent } from './btn-line-login.component';

describe('BtnLineLoginComponent', () => {
  let component: BtnLineLoginComponent;
  let fixture: ComponentFixture<BtnLineLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLineLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnLineLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
