import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRenderDetailComponent } from './game-render-detail.component';

describe('GameRenderDetailComponent', () => {
  let component: GameRenderDetailComponent;
  let fixture: ComponentFixture<GameRenderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRenderDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameRenderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
