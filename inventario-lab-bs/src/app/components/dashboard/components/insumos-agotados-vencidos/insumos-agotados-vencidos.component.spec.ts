import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosAgotadosVencidosComponent } from './insumos-agotados-vencidos.component';

describe('InsumosAgotadosVencidosComponent', () => {
  let component: InsumosAgotadosVencidosComponent;
  let fixture: ComponentFixture<InsumosAgotadosVencidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosAgotadosVencidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosAgotadosVencidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
