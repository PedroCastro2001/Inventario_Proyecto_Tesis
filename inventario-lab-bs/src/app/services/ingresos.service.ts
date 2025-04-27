import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  private baseUrl = 'http://localhost:3000/api/ingresos';

  constructor(private http: HttpClient) { }

  createIngreso(ingreso: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, ingreso);
  }

  createMultipleIngresos(ingresos: any[], no_requisicion: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/lote`, {
      ingresos,
      no_requisicion
    });
  }
}

