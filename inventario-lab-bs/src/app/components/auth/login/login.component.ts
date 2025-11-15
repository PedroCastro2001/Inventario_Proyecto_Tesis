import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    ToastModule,
    Dialog
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  mostrarModalInvitado: boolean = false;
  nombreRealInvitado: string = '';
  areaSeleccionada: 'Laboratorio' | 'Banco de Sangre' | null = null;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  seleccionarArea(area: 'Laboratorio' | 'Banco de Sangre') {
    this.areaSeleccionada = area;
  }

  login() {
    if (!this.areaSeleccionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Área no seleccionada',
        detail: 'Por favor, elige un área antes de continuar'
      });
      return;
    }

    if (!this.user || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos vacíos',
        detail: 'Debes ingresar usuario y contraseña'
      });
      return;
    }

    this.authService.login({ username: this.user, password: this.password, contexto: this.areaSeleccionada}).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: `Hola, ${res.usuario.username}`
        });

        // Guardando el token
        this.authService.guardarToken(res.token);

        //Guardando datos del usuario
        localStorage.setItem('rol', res.usuario.rol);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('mostrarBienvenida', 'true');
        localStorage.setItem('contexto', this.areaSeleccionada || "");

        if (res.usuario.rol === 'Invitado') {
          this.mostrarModalInvitado = true;
        } else {
          localStorage.setItem('nombreUsuarioLogueado', res.usuario.full_name);
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        }

        const payload = JSON.parse(atob(res.token.split('.')[1]));
        console.log('📦 Payload decodificado:', payload);

      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de inicio de sesión',
          detail: err.error?.error || 'Credenciales inválidas'
        });
      }
    });
  }

  confirmarNombreInvitado() {
    const usuario = JSON.parse(localStorage.getItem('usuario')!);

    console.log('Nombre real:', this.nombreRealInvitado);
    console.log('ID de sesión:', usuario.id_sesion);
    const areaSelec = this.areaSeleccionada || "Desconocido";
    this.authService.registrarNombreInvitado(this.nombreRealInvitado, usuario.id_sesion, areaSelec).subscribe({
      next: (res) => {
        localStorage.setItem('id_sesion', res.id_sesion);
        localStorage.setItem('nombreUsuarioLogueado', this.nombreRealInvitado);
        this.mostrarModalInvitado = false;
        this.router.navigate(['/egresos']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error creando sesión',
          detail: 'No se pudo registrar el nombre'
        });
      }
    });
  }


}
