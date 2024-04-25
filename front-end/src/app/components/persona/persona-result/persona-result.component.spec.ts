import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaResultComponent } from './persona-result.component';

describe('PersonaResultComponent', () => {
  let component: PersonaResultComponent;
  let fixture: ComponentFixture<PersonaResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonaResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
