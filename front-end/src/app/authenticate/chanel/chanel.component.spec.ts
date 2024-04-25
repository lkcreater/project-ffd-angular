import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanelComponent } from './chanel.component';
import { HttpClient } from '@angular/common/http';

describe('ChanelComponent', () => {
  let component: ChanelComponent;
  let fixture: ComponentFixture<ChanelComponent>;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChanelComponent],
      providers: [
        {
          provite: HttpClient,
          useValue: {}
        }
      ]
    })
    .compileComponents();
    
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(ChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
