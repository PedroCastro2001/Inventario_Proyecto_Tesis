import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LayoutService } from '../layout/service/layout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl + '/auth';
  
  constructor(
    private http: HttpClient,
    private layoutService: LayoutService
  ) { }

  crearUsuario(data: { username: string, password: string, rol: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/crearUsuario`, data);
  }

  login(data: { username: string, password: string, contexto: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  registrarNombreInvitado(nombre_real: string, id_sesion: number, contexto: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrarNombreInvitado`, { nombre_real, id_sesion, contexto });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombreUsuarioLogueado');
    localStorage.removeItem('darkTheme');
    this.layoutService.resetDarkMode();
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }



}
