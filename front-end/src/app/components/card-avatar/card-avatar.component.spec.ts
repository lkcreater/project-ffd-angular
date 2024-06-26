import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAvatarComponent } from './card-avatar.component';

describe('CardAvatarComponent', () => {
  let component: CardAvatarComponent;
  let fixture: ComponentFixture<CardAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
