import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileConnectComponent } from './profile-connect.component';

describe('ProfileConnectComponent', () => {
  let component: ProfileConnectComponent;
  let fixture: ComponentFixture<ProfileConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileConnectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
