import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasDestinosComponent } from './areas-destinos.component';

describe('AreasDestinosComponent', () => {
  let component: AreasDestinosComponent;
  let fixture: ComponentFixture<AreasDestinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasDestinosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreasDestinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
