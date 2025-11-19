import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
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
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';

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
    AutoCompleteModule,
    ConfirmDialog,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
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
  nombreUsuario: string = '';

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
      private cdRef: ChangeDetectorRef,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
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
    this.nombreUsuario = localStorage.getItem('nombreUsuarioLogueado') || 'Desconocido';
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

  confirmarGuardado(event: Event) {
    if (!this.no_requisicion || this.no_requisicion.trim() === '') {
      this.modalGuardarConReqTemp(event);
    } else {
      this.modalGuardar(event);
    }
  }

  modalGuardar(event: Event){
      this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que deseas guardar todos los ingresos?',
      header: 'Confirmar Guardado',
      icon: 'pi pi-check-circle',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Guardar',
        severity: 'success',
      },
      accept: () => {
          this.guardarTodosLosIngresos();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se guardaron los ingresos',
        });
      },
    });
  }

  modalGuardarConReqTemp(event: Event) {
    this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'No ingresó el número de requisición, ¿Desea guardar todos los ingresos con un número de requisición temporal?',
    header: 'Advertencia',
    icon: 'pi pi-exclamation-triangle',
    closable: true,
    closeOnEscape: true,
    rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Aceptar',
        severity: 'success',
      },
      accept: () => {
        this.no_requisicion = this.generarNoRequisicionTemporal();
        console.log('Número de requisición temporal generado:', this.no_requisicion);
        this.guardarTodosLosIngresos();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se guardaron los ingresos',
        });
      },
    });
  }
  
  guardarTodosLosIngresos() {
    const ingresosAGuardar = this.ingresos.filter((ing) => ing.cod_insumo && ing !== this.filaEditable);
  
    if (ingresosAGuardar.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay ingresos para guardar' });
      return;
    }
  
    if (!this.no_requisicion || this.no_requisicion.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El número de requisición no puede estar vacío' });
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
  
    this.ingresosService.createMultipleIngresos({
      realizado_por: this.nombreUsuario,
      ingresos: ingresosFormateados, 
      no_requisicion: this.no_requisicion
    }).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Ingresos guardados correctamente en la base de datos',
        });
        this.ingresos = [this.crearFilaEditable()];
        this.no_requisicion = '';
        
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
    if (!this.filaEditable.cod_insumo){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El código del insumo no puede estar vacío' });
      return;
    }

    if (!this.filaEditable.presentacion || !this.filaEditable.presentacion.nombre?.trim()){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una presentación' });
      return;
    }

    if (!this.filaEditable.cod_lote){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El código de lote no puede estar vacío' });
      return;
    }

    if (!this.filaEditable.fecha_vencimiento){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha de vencimiento no puede estar vacía' });
      return;
    }

    if (this.filaEditable.cantidad_ingresada <= 0 || !this.filaEditable.cantidad_ingresada){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La cantidad ingresada debe ser mayor a 0' });
      return;
    }

    if (this.filaEditable.cantidad_solicitada <= 0 || !this.filaEditable.cantidad_solicitada){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La cantidad solicitada debe ser mayor a 0' });
      return;
    }

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

eliminarIngreso(index: number) {
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas eliminar este ingreso?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.ingresos.splice(index, 1);
      this.cdRef.detectChanges();
      this.messageService.add({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'Ingreso eliminado correctamente'
      });
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelado',
        detail: 'No se eliminó el ingreso'
      });
    }
  });
}

actualizarDemandaInsatisfecha(fila: any) {
  const ingresada = Number(fila.cantidad_ingresada) || 0;
  const solicitada = Number(fila.cantidad_solicitada) || 0;
  fila.demanda_insatisfecha = (solicitada - ingresada) * -1;
}

generarNoRequisicionTemporal(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `TMP-${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

}
