import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-insumos-por-agotarse',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './insumos-por-agotarse.component.html',
  styleUrl: './insumos-por-agotarse.component.css'
})
export class InsumosPorAgotarseComponent {
  insumosPorAgotarse: any[] = [];

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.consultarInsumosPorAgotarse();
  }

  consultarInsumosPorAgotarse() {
    this.dashboardService.getInsumosPorAgotarse().subscribe({
      next: (data) => {
        this.insumosPorAgotarse = data;
        console.log('Insumos por agotarse:', data);
      },
      error: (err) => {
        console.error('Error al consultar insumos por agotarse:', err);
      }
    })
  }

  irAStockInsumo() {
    this.router.navigate(['/reportes/stockPrincipal']);
  }
}
