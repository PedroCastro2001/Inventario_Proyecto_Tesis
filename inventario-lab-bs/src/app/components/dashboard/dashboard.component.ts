import { Component, OnInit } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Card
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  usuario: any;
  mostrarBienvenida: boolean = false;

  ngOnInit(): void {
    const stored = localStorage.getItem('usuario');
    this.usuario = stored ? JSON.parse(stored) : null;

    const flag = localStorage.getItem('mostrarBienvenida');
    if (flag === 'true') {
      this.mostrarBienvenida = true;
      localStorage.removeItem('mostrarBienvenida'); 
    }
  }

}
