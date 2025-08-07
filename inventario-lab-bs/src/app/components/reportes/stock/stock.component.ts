import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { FluidModule } from 'primeng/fluid';
import { KardexService } from '../../../services/stock.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-kardex-principal',
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    FormsModule,
    IconFieldModule,
    DatePickerModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    FluidModule,
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class KardexPrincipalComponent implements OnInit {
  hastaFecha: Date | null = null;
  resumenStock: any[] = [];

  constructor(private kardexService: KardexService) {}

  ngOnInit(): void {
    this.hastaFecha = new Date(); 
    this.consultarResumenStock();
  }

  consultarResumenStock() {
    if (!this.hastaFecha) return;
  
    const body = {
      hastaFecha: this.hastaFecha.toISOString().split('T')[0] 
    };
  
    this.kardexService.getResumenStock(body).subscribe({
      next: (data) => {
        this.resumenStock = data;
        console.log('Resumen de stock:', this.resumenStock);
      },
      error: (err) => {
        console.error('Error al consultar resumen de stock:', err);
      }
    });
  }

  onGlobalFilter(event: Event, table: Table) {
  const input = event.target as HTMLInputElement;
  table.filterGlobal(input.value, 'contains');
}

getFilasConCantidadASolicitar(){
  return this.resumenStock.filter(item => item.cantidad_a_solicitar > 0);
}

imprimir() {
  const filasFiltradas = this.getFilasConCantidadASolicitar();

  let ventana = window.open('', '_blank');
  if (!ventana) return;

  const contenido = `
    <html>
      <head>
        <title>Imprimir resumen de stock</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 4px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          h2 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h2>Solicitud de pedido para stock (Anexo 3)</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre (corto del catálogo)</th>
              <th>Unidad de medida</th>
              <th>Existencia</th>
              <th>Cantidad a solicitar</th>
            </tr>
          </thead>
          <tbody>
            ${filasFiltradas.map(item => `
              <tr>
                <td>${item.cod_insumo}</td>
                <td>${item.insumo}</td>
                <td>${item.presentacion}</td>
                <td>${item.existencia_actual}</td>
                <td>${item.cantidad_a_solicitar}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  ventana.document.write(contenido);
  ventana.document.close();
  ventana.print();
}

}
