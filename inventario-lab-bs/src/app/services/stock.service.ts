import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  private baseUrl = environment.apiUrl + '/stock';

  constructor(private http: HttpClient) { }

  getResumenStock(body: { hastaFecha: string }) {
    return this.http.post<any[]>(`${this.baseUrl}`, body);
  }

  getBalanceStock(fechaInicio: string, fechaFin: string) {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);

    return this.http.get<any[]>(`${this.baseUrl}/balance-stock`, { params });
  }

}
