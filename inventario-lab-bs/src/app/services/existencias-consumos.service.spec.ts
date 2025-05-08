import { TestBed } from '@angular/core/testing';

import { ExistenciasConsumosService } from './existencias-consumos.service';

describe('ExistenciasConsumosService', () => {
  let service: ExistenciasConsumosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExistenciasConsumosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
