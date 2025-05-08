import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PresentacionService {
  private baseUrl = environment.apiUrl + '/presentaciones';  

  constructor(private http: HttpClient) {}

  getPresentaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  getPresentacion(cod_presentacion: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cod_presentacion}`, { withCredentials: true });
  }

  getPresentacionesInsumo(cod_insumo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/insumo/${cod_insumo}`, { withCredentials: true });
  }

  createPresentacion(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data, { withCredentials: true });
  }

  updatePresentacion(cod_presentacion: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${cod_presentacion}`, data, { withCredentials: true });
  }

  deletePresentacion(cod_presentacion: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cod_presentacion}`, { withCredentials: true });
  }
}
