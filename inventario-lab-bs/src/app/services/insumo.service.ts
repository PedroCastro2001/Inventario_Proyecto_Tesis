import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private baseUrl = 'http://localhost:3000/api/insumos';

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
}
