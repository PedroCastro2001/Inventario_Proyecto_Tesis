import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { FluidModule } from 'primeng/fluid';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InsumoService } from '../../../services/insumo.service';
import { PresentacionService } from '../../../services/presentacion.service';

@Component({
  selector: 'app-insumos',
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    FluidModule,
    DatePickerModule,
    AutoCompleteModule
  ],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css'
})
export class InsumosComponent implements OnInit{
  insumos: any[] = [];
  expandedRows: { [key: string]: boolean } = {}; 

  constructor(private insumosService: InsumoService, private presentacionesService: PresentacionService) {}

  cod_insumo: string = '';
  nombre: string = '';
  cant_min: number | null = null;
  cant_max: number | null = null;

  presentaciones: { codigo: string, descripcion: string }[] = [];

  ngOnInit() {
    this.cod_insumo = '';
    this.nombre = '';
    this.cant_min = null;
    this.cant_max = null;
    this.presentaciones = [];

    this.insumosService.getInsumos().subscribe((insumos) => {
      this.insumos = insumos;
      this.insumos.forEach((insumo) => {
        this.presentacionesService.getPresentacionesInsumo(insumo.cod_insumo).subscribe((presentaciones) => {
          insumo.presentaciones = presentaciones;
        })
      });
      
    });
  }

  expandAll() {
    this.expandedRows = this.insumos.reduce((acc, insumo) => (acc[insumo.cod_insumo] = true) && acc, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  getPresentaciones(codInsumo: number) {
    return this.insumos.find(insumo => insumo.cod_insumo === codInsumo)?.presentaciones || [];
  }

  agregarPresentacion() {
    this.presentaciones.push({ codigo: '', descripcion: '' });
  }

  eliminarPresentacion(index: number) {
    this.presentaciones.splice(index, 1);
  }

  guardarInsumo() {
    const insumo = {
      cod_insumo: this.cod_insumo,  
      nombre: this.nombre,
      fecha_creacion: new Date(),
      cant_min: this.cant_min,
      cant_max: this.cant_max
    };

    this.insumosService.createInsumo(insumo).subscribe((response: any) => {
      console.log('Insumo guardado con éxito', response);

      this.guardarPresentaciones(response.cod_insumo);
      this.ngOnInit();
    }, error => {
      console.error('Error al guardar el insumo:', error);
    });
 
  }

  guardarPresentaciones(codInsumo: number) {
    for (let presentacion of this.presentaciones) {
      const presentacionData = {
        cod_presentacion: presentacion.codigo,  
        nombre: presentacion.descripcion,
        cod_insumo: codInsumo,
        fecha_creacion: new Date()
      };
3
      this.presentacionesService.createPresentacion(presentacionData).subscribe(response => {
        console.log('Presentación guardada con éxito', response);
      }, error => {
        console.error('Error al guardar la presentación:', error);
      });
    }
  }

  onRowExpand(event: any) {
    this.expandedRows[event.data.cod_insumo] = true;
  }

  onRowCollapse(event: any) {
    this.expandedRows[event.data.cod_insumo] = false;
  }
}
