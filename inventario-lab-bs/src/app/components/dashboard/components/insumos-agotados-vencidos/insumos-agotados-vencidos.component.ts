import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-insumos-agotados-vencidos',
  imports: [Popover, PopoverModule, TableModule, CommonModule],
  templateUrl: './insumos-agotados-vencidos.component.html',
  styleUrl: './insumos-agotados-vencidos.component.css'
})
export class InsumosAgotadosVencidosComponent {
  cantidadAgotados: number = 0;
  cantidadRequisicionesTemporales: number = 0;
  cantidadLotesVencidos: number = 0;
  totalTransaccionesHoy: number = 0;
  insumosAgotados: any[] = [];
  lotesVencidos: any[] = [];
  insumoSeleccionado: any;
  loteSeleccionado: any;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.dashboardService.getCantidadInsumosAgotados().subscribe(data => {
      this.cantidadAgotados = data.cantidad_agotados;
      console.log('Cantidad de insumos agotados:', data.cantidad_agotados);
    });

    this.dashboardService.getCantidadReqTemporales().subscribe(data => {
      this.cantidadRequisicionesTemporales = data.cant_req_temporales;
      console.log('Cantidad de requisiciones temporales:', data.cant_req_temporales);
    });

    this.dashboardService.getCantidadLotesVencidos().subscribe(data => {
      this.cantidadLotesVencidos = data.cantidad_lotes_vencidos;
      console.log('Cantidad de lotes vencidos:', data.cantidad_lotes_vencidos);
    });

    this.dashboardService.getTransaccionesHoy().subscribe(data => {
      this.totalTransaccionesHoy = data.total_transacciones_hoy;
      console.log('Total de transacciones hoy:', data.total_transacciones_hoy);
    });
  }

  consultarInsumosAgotados() {
    this.dashboardService.getInsumosAgotados().subscribe({
      next: (data) => {
        this.insumosAgotados = data;
        console.log('Insumos agotados:', data);
      },
      error: (err) => {
        console.error('Error al consultar insumos agotados:', err);
      }
    })
  }

  consultarLotesVencidos() {
    this.dashboardService.getLotesVencidos().subscribe({
      next: (data) => {
        this.lotesVencidos = data;
        console.log('Lotes vencidos:', data);
      },
      error: (err) => {
        console.error('Error al consultar lotes vencidos:', err);
      }
    })
  }

  irARequisicionesTemporales() {
    this.router.navigate(['/requisiciones-temporales']);
  }

  irAHistorialMovimientos() {
    this.router.navigate(['/historial']);
  }


  mostrarInsumosAgotados(event: Event, popover: any) {
    this.consultarInsumosAgotados();
    popover.toggle(event);
  }

  mostrarLotesVencidos(event: Event, popover: any) {
    this.consultarLotesVencidos();
    popover.toggle(event);
  }



}
