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
  providers: [HistorialService]
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
    this.cargarMovimientos();
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
    console.log(this.fechaInicio, this.fechaFin, this.tipo);
    this.cargarMovimientos(); 
  }

  formatoFecha(fecha: Date | undefined): string | undefined {
    return fecha ? fecha.toISOString().split('T')[0] : undefined;
  }

  exportarAPDF() {
  const doc = new jsPDF('p', 'mm', 'a4'); // horizontal (landscape)

  doc.setFontSize(14); // Título un poco más pequeño
  doc.text('Historial de Movimientos', 14, 15);

  const head = [[
    'No.',
    'Fecha',
    'Tipo',
    'Cod. Insumo',
    'Insumo',
    'Presentación',
    'Cod. Lote',
    'Cantidad',
    ...(this.mostrarEgresos ? ['Traslado a'] : []),
    ...(this.mostrarIngresos ? ['No. Requisición', 'Demanda Insatisfecha'] : []),
    'Observaciones'
  ]];

  const data = this.historial.map((item, index) => [
    index + 1,
    item.fecha ? new Date(item.fecha).toLocaleDateString() : '',
    item.tipo_transaccion || '',
    item.cod_insumo || '',
    item.insumo || '',
    item.presentacion || '',
    item.cod_lote || '',
    item.cantidad || '',
    ...(this.mostrarEgresos ? [item.area || '-'] : []),
    ...(this.mostrarIngresos ? [item.no_requisicion || '-', item.demanda_insatisfecha || '-'] : []),
    item.observaciones || '-'
  ]);

  // Calcula el número real de columnas
  const columnCount = head[0].length;

  // Asigna un ancho por columna dinámico (ajusta si quieres)
  const columnWidth = 18; // ejemplo: 18 mm por columna
  const tableWidth = columnCount * columnWidth;

  // Ancho de la página (vertical A4)
  const pageWidth = doc.internal.pageSize.getWidth();

  // Calcula margen izquierdo
  const marginLeft = (pageWidth - tableWidth) / 2;

  autoTable(doc, {
    startY: 22,
    head: head,
    body: data,
    styles: {
      fontSize: 5,
      cellPadding: 2,
    },
    margin: {  left: marginLeft > 4 ? marginLeft : 4, right: 4  }, 
    headStyles: {
      fillColor: [41, 128, 185], 
      fontSize: 5,
      halign: 'center'
    },
    theme: 'grid',
  });

  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
}
}
