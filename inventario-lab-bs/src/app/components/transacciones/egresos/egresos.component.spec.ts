import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosComponent } from './egresos.component';

describe('EgresosComponent', () => {
  let component: EgresosComponent;
  let fixture: ComponentFixture<EgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
