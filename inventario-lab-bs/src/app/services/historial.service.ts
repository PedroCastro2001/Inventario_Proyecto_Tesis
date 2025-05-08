import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private baseUrl = environment.apiUrl + '/historial';

  constructor(private http: HttpClient) { }

  getHistorial(fechaInicio?: string, fechaFin?: string, tipo?: string): Observable<any> {
    let params = new HttpParams();

    if (fechaInicio && fechaFin) {
      params = params.set('fechaInicio', fechaInicio).set('fechaFin', fechaFin);
    }

    if (tipo && tipo !== 'Todos') {
      params = params.set('tipo', tipo);
    }

    return this.http.get(this.baseUrl, { params});
  }
}
