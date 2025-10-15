import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosPorAgotarseComponent } from './insumos-por-agotarse.component';

describe('InsumosPorAgotarseComponent', () => {
  let component: InsumosPorAgotarseComponent;
  let fixture: ComponentFixture<InsumosPorAgotarseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosPorAgotarseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosPorAgotarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
