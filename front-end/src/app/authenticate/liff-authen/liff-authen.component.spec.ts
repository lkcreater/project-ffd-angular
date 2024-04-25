import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiffAuthenComponent } from './liff-authen.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LineService } from '../../services/line/line.service';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

const mockActivatedRoute = {
  queryParams: of({
    liffClientId: '222222'
  })
};

describe('LiffAuthenComponent', () => {
  let component: LiffAuthenComponent;
  let fixture: ComponentFixture<LiffAuthenComponent>;
  let lineService: LineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiffAuthenComponent, HttpClientModule, HttpClientTestingModule],
      providers: [
        LineService,
        provideMockStore({
          initialState: {
            /* your initial state */
          },
        }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiffAuthenComponent);
    lineService = TestBed.inject(LineService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
