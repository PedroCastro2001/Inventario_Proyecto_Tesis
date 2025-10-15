import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesPorVencerComponent } from './lotes-por-vencer.component';

describe('LotesPorVencerComponent', () => {
  let component: LotesPorVencerComponent;
  let fixture: ComponentFixture<LotesPorVencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotesPorVencerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotesPorVencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
