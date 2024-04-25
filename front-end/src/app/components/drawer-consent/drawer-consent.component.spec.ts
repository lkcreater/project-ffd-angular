import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerConsentComponent } from './drawer-consent.component';

describe('DrawerConsentComponent', () => {
  let component: DrawerConsentComponent;
  let fixture: ComponentFixture<DrawerConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerConsentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrawerConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
