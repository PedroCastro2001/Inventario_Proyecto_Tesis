import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistenciasConsumosComponent } from './existencias-consumos.component';

describe('ExistenciasConsumosComponent', () => {
  let component: ExistenciasConsumosComponent;
  let fixture: ComponentFixture<ExistenciasConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistenciasConsumosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistenciasConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
