import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicionesTemporalesComponent } from './requisiciones-temporales.component';

describe('RequisicionesTemporalesComponent', () => {
  let component: RequisicionesTemporalesComponent;
  let fixture: ComponentFixture<RequisicionesTemporalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisicionesTemporalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisicionesTemporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
