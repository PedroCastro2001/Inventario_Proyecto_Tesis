import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  getInsumos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/insumos`, { withCredentials: true });
  }

  getInsumo(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/insumos/${id}`, { withCredentials: true });
  }

  createInsumo(insumo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/insumos`, insumo, { withCredentials: true });
  }

  updateInsumo(id: string, insumo: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/insumos/${id}`, insumo, { withCredentials: true });
  }

  deleteInsumo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/insumos/${id}`,  { withCredentials: true });
  }

}
