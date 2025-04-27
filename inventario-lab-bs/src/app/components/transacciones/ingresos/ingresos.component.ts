import { Component, ElementRef, inject, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

import { IngresosService } from '../../../services/ingresos.service';
import { InsumoService } from '../../../services/insumo.service';
import { PresentacionService } from '../../../services/presentacion.service';
interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-ingresos',
  standalone: true,
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
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush 
})


export class IngresosComponent implements OnInit{

  presentaciones: any[] = [];
  statuses: any[] = [];
  rowGroupMetadata: any;
  expandedRows: expandedRows = {};
  activityValues: number[] = [0, 100];
  isExpanded: boolean = false;
  balanceFrozen: boolean = false;
  loading: boolean = false;
  calendarValue: any = null;
  selectedAutoValue: any = null;
  autoFilteredValue: any[] = [];
  autoValue: any[] | undefined;
  dropdownValue: any = null;
  dropdownValues = [
    { name: 'Principal', code: 'NY' }
];

  insumosDisponibles: any[] = [];
  filteredCodigos: any[] = [];

  ingresos: any[] = []; 
  ingresosPendientes: any[] = [];
  contadorLinea: number = 0;
  filaEditable: any = this.crearFilaEditable();

  @ViewChild('filter') filter!: ElementRef;

  constructor(
      private ingresosService: IngresosService,
      private insumosService: InsumoService,
      private presentacionesService: PresentacionService,
      private cdRef: ChangeDetectorRef 
      
  ) {}

  no_requisicion: string = '';
  cod_insumo: string = '';
  cod_presentacion: string = '';
  insumo: string = '';
  cod_lote: string = '';
  fecha_vencimiento: Date | null = null;
  cantidad_ingresada: number = 0;
  cantidad_solicitada: number = 0;
  demanda_insatisfecha: number = 0;
  observaciones: string = '';

  

  ngOnInit() {
    this.no_requisicion = '';
    this.cod_insumo = '';
    this.cod_presentacion = '';
    this.cod_lote = '';
    this.fecha_vencimiento = null;
    this.cantidad_ingresada = 0;
    this.cantidad_solicitada = 0;
    this.demanda_insatisfecha = 0;
    this.observaciones = '';

    this.insumosDisponibles = [];
    this.insumosService.getInsumos().subscribe(
    (data) => {
        this.insumosDisponibles = data;
    },
    (error) => {
        console.error('Error al obtener los insumos:', error);
    }
    );

    this.ingresos = [this.crearFilaEditable()];
  }

  crearFilaEditable(){
    return {
        linea: this.contadorLinea++,
        cod_insumo: '',
        insumo: '',
        cod_presentacion: '',
        presentacionesDisponibles: [],
        cod_lote: '',
        fecha_vencimiento: null,
        cantidad_ingresada: 0,
        cantidad_solicitada: 0,
        demanda_insatisfecha: 0,
        observaciones: '',
    };
  }

  filtrarCodigos(event: any) {
    const query = event.query.toString().toLowerCase();
    this.filteredCodigos = this.insumosDisponibles.filter((insumo) =>
      insumo.cod_insumo.toString().toLowerCase().includes(query) ||
        insumo.nombre.toString().toLowerCase().includes(query)
    );
  }

  filtrarPresentaciones(event: any, ingreso: any) {
    const query = event.query.toString().toLowerCase();
    ingreso.presentacionesFiltradas = ingreso.presentacionesDisponibles.filter((p: any) =>
      p.nombre.toLowerCase().includes(query) || p.cod_presentacion.toString().includes(query)
    );
  }

  setInsumoName(ingreso: any, selected: any) {
    
        console.log(selected.value.nombre);
        ingreso.insumo = selected.value.nombre;
        ingreso.cod_insumo = selected.value.cod_insumo;

        this.presentacionesService.getPresentacionesInsumo(selected.value.cod_insumo).subscribe({
            next: (presentaciones) => {
                ingreso.presentacionesDisponibles = presentaciones;
                console.log('Presentaciones disponibles:', ingreso.presentacionesDisponibles);
                ingreso.presentacion = null;
                this.cdRef.detectChanges();
            },
            error: (error) => {
                console.error('Error al obtener las presentaciones:', error);
                ingreso.presentacionesDisponibles = [];
            }
        })
}

  /*expandAll() {
      if (!this.isExpanded) {
          this.products.forEach((product) => (product && product.name ? (this.expandedRows[product.name] = true) : ''));
      } else {
          this.expandedRows = {};
      }
      this.isExpanded = !this.isExpanded;
  }*/

  formatCurrency(value: number) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }

  getSeverity(status: string) {
      switch (status) {
          case 'qualified':
          case 'instock':
          case 'INSTOCK':
          case 'DELIVERED':
          case 'delivered':
              return 'success';

          case 'negotiation':
          case 'lowstock':
          case 'LOWSTOCK':
          case 'PENDING':
          case 'pending':
              return 'warn';

          case 'unqualified':
          case 'outofstock':
          case 'OUTOFSTOCK':
          case 'CANCELLED':
          case 'cancelled':
              return 'danger';

          default:
              return 'info';
      }
  }

  guardarTodosLosIngresos() {
    const ingresosAGuardar = this.ingresos.filter((ing) => ing.cod_insumo && ing !== this.filaEditable);
  
    if (ingresosAGuardar.length === 0) {
      alert('No hay ingresos para guardar.');
      return;
    }
  
    const noReqNum = Number(this.no_requisicion);
    if (isNaN(noReqNum) || noReqNum <= 0) {
      alert('El número de requisición no es válido.');
      return;
    }

    const ingresosFormateados = ingresosAGuardar.map((ing) => {
      let fecha = ing.fecha_vencimiento;
      if (fecha instanceof Date) {
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        fecha = `${yyyy}-${mm}-${dd}`;
      }
    
      return {
        ...ing,
        cod_presentacion: ing.presentacion?.cod_presentacion || null,
        fecha_vencimiento: fecha
      };
    });

    console.log('Ingresos a guardar:', ingresosFormateados);
  
    this.ingresosService.createMultipleIngresos(ingresosFormateados, noReqNum).subscribe({
      next: (res) => {
        console.log(res);
        alert('Ingresos guardados correctamente en la BD');
        this.ingresos = [this.crearFilaEditable()];
        
      },
      error: (err) => {
        console.error('Error al guardar ingresos:', err);
        alert('Hubo un error al guardar los ingresos');
      }
    });
  }

agregarFilaVacia() {
    const nuevaFila = {
        linea: this.contadorLinea++,
        cod_insumo: '',
        insumo: '',
        cod_presentacion: '',
        cod_lote: '',
        fecha_vencimiento: null,
        cantidad_ingresada: 0,
        cantidad_solicitada: 0,
        demanda_insatisfecha: 0,
        observaciones: '',
      };
    
      this.ingresos.push(nuevaFila);
      this.cdRef.detectChanges();
  }

  onGuardarIngreso() {
    if (!this.filaEditable.cod_insumo) return;

    const ingresoNuevo = {
        ...this.filaEditable,
        linea: this.contadorLinea++,
    };

    this.ingresos.push(ingresoNuevo);
    this.filaEditable = this.crearFilaEditable();
    this.cdRef.detectChanges();
  }

onRowEditCancel(ingreso: any, index: number) {

    ingreso.editing = false;
}

onRowEditInit(index: number) {
    console.log('Iniciando edición en la fila:', index);
    this.ingresos.forEach((ing, i) => ing.editing = i === index);
    this.cdRef.detectChanges(); 
}

onRowEditSave(ingreso: any, index: number) {
    this.ingresos[index].editing = false;

}


limpiarFormulario() {
    this.no_requisicion = '';
    this.cod_insumo = '';
    this.cod_lote = '';
    this.fecha_vencimiento = null;
    this.cantidad_ingresada = 0;
    this.cantidad_solicitada = 0;
    this.demanda_insatisfecha = 0;
    this.observaciones = '';
}

guardarIngreso(){
    const ingreso = {
        no_requisicion: this.no_requisicion,
        cod_insumo: this.cod_insumo,
        cod_lote: this.cod_lote,
        fecha_vencimiento: this.fecha_vencimiento,
        cantidad_ingresada: this.cantidad_ingresada,
        cantidad_solicitada: this.cantidad_solicitada,
        demanda_insatisfecha: this.demanda_insatisfecha,
        observaciones: this.observaciones
    };
    
    this.ingresosService.createIngreso(ingreso).subscribe((response: any) => {
        console.log('Ingreso guardado con éxito', response);
       //this.ngOnInit();
    }, error => {
        console.error('Error al guardar el ingreso:', error);
    });
}

}
