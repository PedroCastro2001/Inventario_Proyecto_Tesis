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
}
