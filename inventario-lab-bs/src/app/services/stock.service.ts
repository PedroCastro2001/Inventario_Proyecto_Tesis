import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  private baseUrl = environment.apiUrl + '/stock';

  constructor(private http: HttpClient) { }

  getResumenStock(body: { hastaFecha: string }) {
    return this.http.post<any[]>(`${this.baseUrl}`, body, { withCredentials: true });
  }
  
}
