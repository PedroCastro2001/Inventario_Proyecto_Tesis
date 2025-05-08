import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  private baseUrl = environment.apiUrl + '/ingresos';

  constructor(private http: HttpClient) { }

  createIngreso(ingreso: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, ingreso, { withCredentials: true });
  }

  createMultipleIngresos(ingresos: any[], no_requisicion: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/lote`, {
      ingresos,
      no_requisicion
    }, { withCredentials: true });
  }
}

