import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaIconComponent } from './persona-icon.component';

describe('PersonaIconComponent', () => {
  let component: PersonaIconComponent;
  let fixture: ComponentFixture<PersonaIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonaIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
