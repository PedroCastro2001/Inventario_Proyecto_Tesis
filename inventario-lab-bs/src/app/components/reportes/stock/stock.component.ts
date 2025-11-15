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
    //this.consultarResumenStock();
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

  if (!filasFiltradas || filasFiltradas.length === 0) {
    alert('No hay datos para imprimir.');
    return;
  }

  // Agrupar por código + nombre de insumo
  const grupos: Record<string, typeof filasFiltradas> = {};
  filasFiltradas.forEach(item => {
    const key = `${item.cod_insumo}|${item.insumo}`;
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(item);
  });

  const contenido = `
    <html>
      <head>
        <title>Imprimir resumen de stock</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }

          .encabezado {
            width: 100%;
            margin-bottom: 20px;
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
            font-size: 18px;
          }

          .linea-centro .anexo {
            font-weight: bold;
            font-size: 14px;
          }

          .linea-centro .control {
            font-weight: normal;
            font-size: 12px;
            margin-top: 5px;
          }

          .linea-derecha {
            text-align: right;
            font-size: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
          }

          .linea-derecha div {
            display: flex;
            gap: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 4px;
            text-align: center;
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
       <div class="encabezado">
          <div class="linea">
            <div class="linea-izquierda">
              <img  src="https://pbs.twimg.com/profile_images/1085895369873997824/jbNZ9Fr2_400x400.png" alt="Mi Logo" alt="Logo" />
            </div>
            <div class="linea-centro">
              <div class="hospital">HOSPITAL NACIONAL DE ESPECIALIDADES QUIRÚRGICAS DE VILLA NUEVA</div>
              <div class="anexo">ANEXO 3</div>
              <div class="control">SOLICITUD DE PEDIDO PARA STOCK - ${localStorage.getItem('contexto')?.toUpperCase()}</div>
            </div>
            <div class="linea-derecha">
              <div><strong>CÓDIGO:</strong> _________</div>
              <div><strong>VIGENCIA:</strong> _________</div>
              <div><strong>EDICIÓN:</strong> _________</div>
            </div>
          </div>
        </div>

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
            ${Object.values(grupos).map(grupo => 
              grupo.map((item, index) => `
                <tr>
                  ${index === 0 ? `<td rowspan="${grupo.length}">${item.cod_insumo}</td>` : ''}
                  ${index === 0 ? `<td rowspan="${grupo.length}">${item.insumo}</td>` : ''}
                  <td>${item.presentacion}</td>
                  <td>${item.existencia_actual}</td>
                  <td>${item.cantidad_a_solicitar}</td>
                </tr>
              `).join('')
            ).join('')}
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

imprimirExistencias() {
  if (!this.resumenStock || this.resumenStock.length === 0) {
    alert('No hay datos para imprimir.');
    return;
  }

  // Agrupar por código + nombre de insumo
  const grupos: Record<string, typeof this.resumenStock> = {};
  this.resumenStock.forEach(item => {
    const key = `${item.cod_insumo}|${item.insumo}`;
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(item);
  });

  const contenido = `
    <html>
      <head>
        <title>Imprimir resumen de stock</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }

          .encabezado {
            width: 100%;
            margin-bottom: 20px;
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
            font-size: 18px;
          }

          .linea-centro .anexo {
            font-weight: bold;
            font-size: 14px;
          }

          .linea-centro .control {
            font-weight: normal;
            font-size: 12px;
            margin-top: 5px;
          }

          .linea-derecha {
            text-align: right;
            font-size: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
          }

          .linea-derecha div {
            display: flex;
            gap: 5px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 4px;
            text-align: center;
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
       <div class="encabezado">
          <div class="linea">
            <div class="linea-izquierda">
              <img  src="https://pbs.twimg.com/profile_images/1085895369873997824/jbNZ9Fr2_400x400.png" alt="Mi Logo" alt="Logo" />
            </div>
            <div class="linea-centro">
              <div class="hospital">HOSPITAL NACIONAL DE ESPECIALIDADES QUIRÚRGICAS DE VILLA NUEVA</div>
              <div class="control">EXISTENCIAS EN STOCK - ${localStorage.getItem('contexto')?.toUpperCase()}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre (corto del catálogo)</th>
              <th>Unidad de medida</th>
              <th>Existencia</th>
            </tr>
          </thead>
          <tbody>
            ${Object.values(grupos).map(grupo => 
              grupo.map((item, index) => `
                <tr>
                  ${index === 0 ? `<td rowspan="${grupo.length}">${item.cod_insumo}</td>` : ''}
                  ${index === 0 ? `<td rowspan="${grupo.length}">${item.insumo}</td>` : ''}
                  <td>${item.presentacion}</td>
                  <td>${item.existencia_actual}</td>
                </tr>
              `).join('')
            ).join('')}
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
