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
    return this.http.post(`${this.baseUrl}`, ingreso);
  }

  createMultipleIngresos(ingresos: any[], no_requisicion: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/lote`, {
      ingresos,
      no_requisicion
    });
  }

  getIngresosReqTemporal(): Observable<any> {
    return this.http.get(`${this.baseUrl}/req_temporales`);
  }

  updateNoRequisicion(tempNoRequisicion: string, newNoRequisicion: string): Observable<any> {
    console.log('Actualizando número de requisición:', tempNoRequisicion, 'a', newNoRequisicion);
    return this.http.post(`${this.baseUrl}/actualizar_no_requisicion`, { tempNoRequisicion, newNoRequisicion });
  }
}

