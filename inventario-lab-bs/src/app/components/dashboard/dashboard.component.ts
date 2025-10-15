import { Component, OnInit } from '@angular/core';
import {CardModule} from 'primeng/card';
import { InsumosPorAgotarseComponent } from './components/insumos-por-agotarse/insumos-por-agotarse.component';
import { LotesPorVencerComponent } from './components/lotes-por-vencer/lotes-por-vencer.component';
import { InsumosAgotadosVencidosComponent } from './components/insumos-agotados-vencidos/insumos-agotados-vencidos.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    InsumosPorAgotarseComponent,
    LotesPorVencerComponent,
    InsumosAgotadosVencidosComponent,
    CardModule
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
