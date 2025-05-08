import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private baseUrl = environment.apiUrl + '/areas';

  constructor(private http: HttpClient) {}

  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  getArea(cod_area: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${cod_area}`, { withCredentials: true });
  }

  createArea(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data, { withCredentials: true });
  }

  updateArea(cod_area: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${cod_area}`, data, { withCredentials: true });
  }

  deleteArea(cod_area: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${cod_area}`, { withCredentials: true });
  }
}
