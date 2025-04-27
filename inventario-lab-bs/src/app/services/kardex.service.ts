import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  private baseUrl = 'http://localhost:3000/api/kardex';

  constructor(private http: HttpClient) { }

  getReporteKardex(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  
}
