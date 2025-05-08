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

  obtenerReporteExistencias(fecha: string): Observable<any> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get(`${this.baseUrl}`, { params});
  }
}
