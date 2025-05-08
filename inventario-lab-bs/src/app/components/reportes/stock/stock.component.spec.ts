import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexPrincipalComponent } from './stock.component';

describe('KardexPrincipalComponent', () => {
  let component: KardexPrincipalComponent;
  let fixture: ComponentFixture<KardexPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
