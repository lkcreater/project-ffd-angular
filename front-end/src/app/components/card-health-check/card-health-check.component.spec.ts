import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHealthCheckComponent } from './card-health-check.component';

describe('CardHealthCheckComponent', () => {
  let component: CardHealthCheckComponent;
  let fixture: ComponentFixture<CardHealthCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHealthCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardHealthCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
