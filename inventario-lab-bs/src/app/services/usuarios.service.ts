import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(this.baseUrl, usuario);
  }

  cambiarContrasena(id_usuario: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_usuario}/password`, data);
  }

  actualizarEstadoUsuario(id_usuario: number, activo: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_usuario}/estado`, { activo });
  }

  eliminarUsuario(id_usuario: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id_usuario}`);
  }
}