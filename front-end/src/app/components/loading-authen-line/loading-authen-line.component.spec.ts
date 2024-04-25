import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingAuthenLineComponent } from './loading-authen-line.component';

describe('LoadingAuthenLineComponent', () => {
  let component: LoadingAuthenLineComponent;
  let fixture: ComponentFixture<LoadingAuthenLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingAuthenLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingAuthenLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
