import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private baseUrl = environment.apiUrl + '/insumos';

  constructor(private http: HttpClient) { }

  getInsumos(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getInsumo(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createInsumo(insumo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, insumo);
  }

  updateInsumo(id: string, insumo: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, insumo);
  }

  deleteInsumo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  uploadCSV(file: File) {
    const formData = new FormData();
    formData.append('archivo', file);
    return this.http.post(`${this.baseUrl}/carga-masiva`, formData);
  }
}
