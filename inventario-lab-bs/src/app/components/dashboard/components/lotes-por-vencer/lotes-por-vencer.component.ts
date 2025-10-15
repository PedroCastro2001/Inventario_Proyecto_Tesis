import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DashboardService } from '../../../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lotes-por-vencer',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './lotes-por-vencer.component.html',
  styleUrl: './lotes-por-vencer.component.css'
})
export class LotesPorVencerComponent {
  lotesPorVencer: any[] = [];

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.consultarLotesPorVencer();
  }

  consultarLotesPorVencer() {
    this.dashboardService.getLotesPorVencer().subscribe({
      next: (data) => {
        this.lotesPorVencer = data;
        console.log('Lotes por vencer:', data);
      },
      error: (err) => {
        console.error('Error al consultar lotes por vencer:', err);
      }
    })
  }

  irAEgresos(){
    this.router.navigate(['/egresos']);
  }

}
