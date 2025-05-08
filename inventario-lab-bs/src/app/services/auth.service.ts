import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl + '/auth';
  
  constructor(private http: HttpClient) { }

  crearUsuario(data: { username: string, password: string, rol: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/crearUsuario`, data);
  }

  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  registrarNombreInvitado(nombre_real: string, id_sesion: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrarNombreInvitado`, { nombre_real, id_sesion });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/logout`);
  }

}
