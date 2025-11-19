import { Component ,OnInit } from '@angular/core';
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

import { ExistenciasConsumosService } from '../../../services/existencias-consumos.service';

@Component({
  selector: 'app-existencias-consumos',
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
  templateUrl: './existencias-consumos.component.html',
  styleUrl: './existencias-consumos.component.css'
})
export class ExistenciasConsumosComponent implements OnInit{
  desdeFecha: Date | null = null;
  hastaFecha: Date | null = null;
  existenciasConsumos: any[] = [];
  cargando: boolean = false;

  constructor(private existenciasConsumosService: ExistenciasConsumosService) {}

  ngOnInit(): void {
    this.desdeFecha = new Date();
    this.hastaFecha = new Date();
    this.consultarExistenciasConsumos();
  }

  consultarExistenciasConsumos() {
    if (!this.hastaFecha || !this.desdeFecha) {
      return;
    }


    const fechaFormateadaInicio = this.desdeFecha.toISOString().split('T')[0];
    const fechaFormateada = this.hastaFecha.toISOString().split('T')[0];


    this.cargando = true;
    this.existenciasConsumosService.obtenerReporteExistencias(fechaFormateadaInicio, fechaFormateada).subscribe({
      next: (data) => {
        this.existenciasConsumos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener existencias y consumos:', err);
        this.cargando = false;
      }
    });


  }

}
