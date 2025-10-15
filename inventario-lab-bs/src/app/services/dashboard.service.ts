import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 private baseUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  getInsumosPorAgotarse(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/insumos-por-agotarse`);
  }

  getLotesPorVencer(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lotes-proximos-a-vencer`);
  }

  getInsumosAgotados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/insumos-agotados`);
  }

  getCantidadInsumosAgotados(): Observable<{ cantidad_agotados: number }> {
    return this.http.get<{ cantidad_agotados: number }>(`${this.baseUrl}/cantidad-insumos-agotados`);
  }

  getCantidadReqTemporales(): Observable<{ cant_req_temporales: number }> {
    return this.http.get<{ cant_req_temporales: number }>(`${this.baseUrl}/cantidad-requisiciones-temporales`);
  }

  getCantidadLotesVencidos(): Observable<{ cantidad_lotes_vencidos: number }> {
    return this.http.get<{ cantidad_lotes_vencidos: number }>(`${this.baseUrl}/cantidad-lotes-vencidos`);
  }

  getLotesVencidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lotes-vencidos`);
  }

  getTransaccionesHoy(): Observable<{ total_transacciones_hoy: number }> {
    return this.http.get<{ total_transacciones_hoy: number }>(`${this.baseUrl}/transacciones-hoy`);
  }

}
