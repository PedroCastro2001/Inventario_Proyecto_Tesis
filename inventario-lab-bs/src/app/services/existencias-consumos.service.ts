import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExistenciasConsumosService {

  private baseUrl = environment.apiUrl + '/existencias-consumos';

  constructor(private http: HttpClient) { }

  obtenerReporteExistencias(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    return this.http.get(`${this.baseUrl}`, { params });
  }
}
