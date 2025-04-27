import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {

  private baseUrl = 'http://localhost:3000/api/destinos';

  constructor(private http: HttpClient) {}

  getDestinos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getDestino(cod_destino: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cod_destino}`);
  }

  createDestino(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  updateDestino(cod_destino: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${cod_destino}`, data);
  }

  deleteDestino(cod_destino: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cod_destino}`);
  }
}
