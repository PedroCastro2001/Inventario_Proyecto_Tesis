import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  getInsumos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/insumos`);
  }

  getInsumo(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/insumos/${id}`);
  }

  createInsumo(insumo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/insumos`, insumo);
  }

  updateInsumo(id: string, insumo: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/insumos/${id}`, insumo);
  }

  deleteInsumo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/insumos/${id}`);
  }

}
