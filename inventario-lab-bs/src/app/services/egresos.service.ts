import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {

  private baseUrl = environment.apiUrl +'/egresos';

  constructor(private http: HttpClient) { }

  createEgreso(egreso: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, egreso);
  }

  createMultipleEgresos(payload: { realizado_por: string; egresos: any[]}): Observable<any> {
    return this.http.post(`${this.baseUrl}/lote`, payload);
  }

  getLotesPorInsumoYPres(cod_insumo: number, cod_presentacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/lotes/${cod_insumo}/${cod_presentacion}`);
  }

  getCantidadDisponiblePorLote(cod_insumo: number, cod_presentacion: number, cod_lote: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/lotes/${cod_insumo}/${cod_presentacion}/${cod_lote}`);
  }
}
