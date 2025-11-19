import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { HistorialService } from '../../services/historial.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    TableModule, 
    TagModule, 
    IconFieldModule, 
    InputTextModule, 
    InputIconModule, 
    MultiSelectModule, 
    SelectModule, 
    HttpClientModule, 
    CommonModule,
    DatePickerModule,
    FormsModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
  providers: []
})
export class HistorialComponent implements OnInit{
  historial: any[] = [];
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoSeleccionado: string = 'Todos';
  tipo: string = 'Todos';
  tipos: string[] = ['Todos', 'Ingreso', 'Egreso'];
  mostrarIngresos = true;
  mostrarEgresos = true;
  

  constructor(private historialService: HistorialService) {}

  ngOnInit(): void {
  }

  cargarMovimientos() {
    this.historialService.getHistorial(this.formatoFecha(this.fechaInicio), this.formatoFecha(this.fechaFin), this.tipo)
      .subscribe({
        next: (data) => {
          this.historial = data;
        },
        error: (err) => {
          console.error('Error cargando historial:', err);
        }
      });
  }

  buscar() {
    this.tipo = this.tipoSeleccionado;

    this.mostrarIngresos = this.tipo === 'Todos' || this.tipo === 'Ingreso';
    this.mostrarEgresos = this.tipo === 'Todos' || this.tipo === 'Egreso';
    this.cargarMovimientos(); 
  }

  formatoFecha(fecha: Date | undefined): string | undefined {
    return fecha ? fecha.toISOString().split('T')[0] : undefined;
  }

exportarAPDF() {
  if (!this.historial || this.historial.length === 0) {
    alert('No hay datos para imprimir.');
    return;
  }

  // Generar texto del periodo
  let periodoTexto = '';
  if (this.fechaInicio && this.fechaFin) {
    periodoTexto = `Periodo: ${new Date(this.fechaInicio).toLocaleDateString()} al ${new Date(this.fechaFin).toLocaleDateString()}`;
  } else if (this.fechaInicio) {
    periodoTexto = `Desde: ${new Date(this.fechaInicio).toLocaleDateString()}`;
  } else if (this.fechaFin) {
    periodoTexto = `Hasta: ${new Date(this.fechaFin).toLocaleDateString()}`;
  }

  const contenido = `
    <html>
      <head>
        <title>Historial de Movimientos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 15px 25px 15px 25px;
          }

          .encabezado {
            width: 100%;
            margin-bottom: 10px;
          }

          .linea {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .linea-izquierda img {
            width: 80px;
          }

          .linea-centro {
            text-align: center;
            flex: 1;
          }

          .linea-centro .hospital {
            font-weight: bold;
            font-size: 16px;
          }

          .linea-centro .titulo {
            font-weight: bold;
            font-size: 14px;
            margin-top: 3px;
          }

          .periodo {
            font-weight: bold;
            text-align: center;
            font-size: 12px;
            margin-bottom: 15px;
            margin-top: 15px;
          }

          table {
            width: 98%;
            border-collapse: collapse;
            font-size: 10px;
            margin-left: auto;
            margin-right: auto;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 3px;
            text-align: center;
          }

          th {
            background-color: #f5f5f5;
          }

          @media print {
            body { margin: 10mm; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <div class="encabezado">
          <div class="linea">
            <div class="linea-izquierda">
              <img src="https://pbs.twimg.com/profile_images/1085895369873997824/jbNZ9Fr2_400x400.png" alt="Logo" />
            </div>
            <div class="linea-centro">
              <div class="hospital">HOSPITAL NACIONAL DE ESPECIALIDADES QUIRÚRGICAS DE VILLA NUEVA</div>
              <div class="titulo">Historial de Movimientos - ${localStorage.getItem('contexto')}</div>
               ${periodoTexto ? `<div class="periodo">${periodoTexto}</div>` : ''}
            </div>
          </div>
        </div>

       

        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Realizado Por</th>
              <th>Código Insumo</th>
              <th>Insumo</th>
              <th>Presentación</th>
              <th>Cód. Lote</th>
              <th>Cantidad</th>
              ${this.mostrarEgresos ? '<th>Traslado a</th>' : ''}
              ${this.mostrarIngresos ? '<th>No. Requisición</th><th>Demanda Insatisfecha</th>' : ''}
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.historial.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.fecha ? new Date(item.fecha).toLocaleDateString() : ''}</td>
                <td>${item.tipo_transaccion || ''}</td>
                <td>${item.realizado_por || ''}</td>
                <td>${item.cod_insumo || ''}</td>
                <td>${item.insumo || ''}</td>
                <td>${item.presentacion || ''}</td>
                <td>${item.cod_lote || ''}</td>
                <td>${item.cantidad || ''}</td>
                ${this.mostrarEgresos ? `<td>${item.area || '-'}</td>` : ''}
                ${this.mostrarIngresos ? `<td>${item.no_requisicion || '-'}</td><td>${item.demanda_insatisfecha || '-'}</td>` : ''}
                <td>${item.observaciones || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(contenido);
    doc.close();
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }

  setTimeout(() => document.body.removeChild(iframe), 1000);
}

}


