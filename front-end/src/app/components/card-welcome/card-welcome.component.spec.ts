import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWelcomeComponent } from './card-welcome.component';
import { ActivatedRoute } from '@angular/router';

describe('CardWelcomeComponent', () => {
  let component: CardWelcomeComponent;
  let fixture: ComponentFixture<CardWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWelcomeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
