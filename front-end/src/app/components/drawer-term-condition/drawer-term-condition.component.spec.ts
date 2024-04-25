import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerTermConditionComponent } from './drawer-term-condition.component';

describe('DrawerTermConditionComponent', () => {
  let component: DrawerTermConditionComponent;
  let fixture: ComponentFixture<DrawerTermConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerTermConditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrawerTermConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
