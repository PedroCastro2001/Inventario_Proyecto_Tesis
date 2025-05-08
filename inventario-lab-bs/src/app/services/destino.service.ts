import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {

  private baseUrl = environment.apiUrl + '/destinos';

  constructor(private http: HttpClient) {}

  getDestinos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  getDestino(cod_destino: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cod_destino}`, { withCredentials: true });
  }

  createDestino(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data, { withCredentials: true });
  }

  updateDestino(cod_destino: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${cod_destino}`, data, { withCredentials: true });
  }

  deleteDestino(cod_destino: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cod_destino}`, { withCredentials: true });
  }
}
