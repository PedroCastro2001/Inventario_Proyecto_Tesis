import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private baseUrl = 'http://localhost:3000/api/areas';

  constructor(private http: HttpClient) {}

  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getArea(cod_area: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cod_area}`);
  }

  createArea(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  updateArea(cod_area: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${cod_area}`, data);
  }

  deleteArea(cod_area: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cod_area}`);
  }
}
