import { Component, ElementRef, inject, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { InsumoService } from '../../../services/insumo.service';
import { PresentacionService } from '../../../services/presentacion.service';
import { EgresosService } from '../../../services/egresos.service';
import { AreaService } from '../../../services/area.service';
import { CommonModule } from '@angular/common';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-egresos',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    AutoCompleteModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    IconFieldModule,
    ToastModule,
    ConfirmDialog,
    Dialog
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './egresos.component.html',
  styleUrl: './egresos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class EgresosComponent implements OnInit{
  presentaciones: any[] = [];
  insumosDisponibles: any[] = [];
  filteredCodigos: any[] = [];
  egresos: any[] = [];
  egresosPendientes: any[] = [];
  contadorLinea: number = 0;
  filaEditable: any = this.crearFilaEditable();
  loading: boolean = false;
  areasDisponibles: any[] = [];
  areaSeleccionada: any = null;
  nombreUsuario: string = '';

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private insumoService: InsumoService,
    private presentacionService: PresentacionService,
    private egresosService: EgresosService,
    private areaService: AreaService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  cod_insumo: string = '';
  insumo: string = '';
  cod_area: string = '';
  cantidad: number = 0;
  observaciones: string = '';
  mostrarDialogJustificacion: boolean = false;
  justificacionTexto: string = '';




  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombreUsuarioLogueado') || 'Desconocido';
    this.cod_insumo = '';
    this.insumo = '';
    this.cod_area = '';
    this.cantidad = 0;
    this.observaciones = '';

    this.areaService.getAreas().subscribe({
      next: (areas) => {
        this.areasDisponibles = areas;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener áreas:', err);
      }
    });

    this.insumosDisponibles = [];
    this.insumoService.getInsumos().subscribe(
      (data) => {
        this.insumosDisponibles = data;
      },
      (error) => {
        console.error('Error al obtener los insumos:', error);
      }
    )

    this.egresos = [this.crearFilaEditable()]; 
    
  }

  crearFilaEditable(){
    return {
      linea: this.contadorLinea++,
      cod_insumo: '',
      insumo: '',
      cod_presentacion: '',
      presentacionesDisponibles: [],
      lote_seleccionado: null,
      cod_lote: '',
      fecha_vencimiento: '',
      cod_area: '',
      cantidad: 0,
      observaciones: ''
    };

  }

  filtrarCodigos(event: any) {
    const query = event.query.toString().toLowerCase();
    this.filteredCodigos = this.insumosDisponibles.filter((insumo) =>
      insumo.cod_insumo.toString().toLowerCase().includes(query) ||
        insumo.nombre.toString().toLowerCase().includes(query)
    );
  }

  filtrarPresentaciones(event: any, egreso: any) {
    const query = event.query.toString().toLowerCase();
    egreso.presentacionesFiltradas = egreso.presentacionesDisponibles.filter((p: any) =>
      p.nombre.toLowerCase().includes(query) || p.cod_presentacion.toString().includes(query)
    );
  }

  setInsumoName(egreso: any, selected: any) {
    
    console.log(selected.value.nombre);
    egreso.insumo = selected.value.nombre;
    egreso.cod_insumo = selected.value.cod_insumo;

    this.presentacionService.getPresentacionesInsumo(selected.value.cod_insumo).subscribe({
        next: (presentaciones) => {
            egreso.presentacionesDisponibles = presentaciones;
            console.log('Presentaciones disponibles:', egreso.presentacionesDisponibles);
            egreso.presentacion = null;

            egreso.lote_seleccionado = null;
            egreso.cod_lote = '';
            egreso.fecha_vencimiento = '';
            egreso.cantidad_ingresada = 0;

            this.cdRef.detectChanges();
        },
        error: (error) => {
            console.error('Error al obtener las presentaciones:', error);
            egreso.presentacionesDisponibles = [];
        }
    })
}

onPresentacionSelect(egreso: any) {
  const cod_insumo = egreso.cod_insumo;
  const cod_presentacion = egreso.presentacion?.cod_presentacion;

  if (cod_insumo && cod_presentacion) {
    this.egresosService.getLotesPorInsumoYPres(cod_insumo, cod_presentacion).subscribe({
      next: (lotes) => {
        egreso.lotesDisponibles = lotes;
        egreso.loteFiltrado = lotes;

        egreso.lote_seleccionado = null;
        egreso.cod_lote = '';
        egreso.fecha_vencimiento = '';
        egreso.cantidad_ingresada = 0;

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener lotes:', err);
        egreso.lotesDisponibles = [];
      }
    });
  }
}

onLoteSelect(egreso: any, event: any) {
  console.log('Lote seleccionado:', event);
  egreso.lote_seleccionado = event.value;
  egreso.cod_lote = event.cod_lote;
  egreso.fecha_vencimiento = event.value.fecha_vencimiento;

  this.egresosService.getCantidadDisponiblePorLote(egreso.cod_insumo, egreso.presentacion.cod_presentacion, event.value.cod_lote).subscribe({
    next: (data) => {
      egreso.cantidad_disponible = data.cantidad_disponible;
      egreso.cantidad_ingresada = egreso.cantidad_disponible;
      this.cdRef.detectChanges();
    },
    error: (err) => {
      console.error('Error al obtener cantidad disponible por lote:', err);
      egreso.cantidad_disponible = 0;
      egreso.cantidad_ingresada = 0;
      this.cdRef.detectChanges();
    }
  });

  egreso.cantidad_disponible = event.value.cantidad_disponible || 0;
  egreso.cantidad_ingresada = egreso.cantidad_disponible;
  this.cdRef.detectChanges();

  // Calculando los días restantes hasta la fecha de vencimiento del lote seleccionado
  const hoy = new Date();
  const selectedFecha = new Date(event.value.fecha_vencimiento);
  const selectedDias = Math.ceil((selectedFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

  // Validando si hay algún lote en rojo (fecha de vencimiento < 3 meses)
  const existeRojo = egreso.lotesDisponibles.some((lote: any) => {
    const fecha = new Date(lote.fecha_vencimiento);
    const dias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return dias < 90;
  });

  console.log("existeRojo:", existeRojo);
  console.log("selectedDias:", selectedDias);

  // Si el lote seleccionado NO es rojo (<3 meses) pero sí hay rojos disponibles
  if (existeRojo && selectedDias >= 90) {
    this.justificarLote();
  }

}

filtrarLotes(event: any, egreso: any) {
  const query = event.query.toLowerCase();
  egreso.loteFiltrado = egreso.lotesDisponibles.filter((lote: any) =>
    lote.cod_lote.toLowerCase().includes(query)
  );
}

onRowEditInit(index: number) {
  console.log('Iniciando edición en la fila:', index);
  this.egresos.forEach((egr, e) => egr.editing = e === index);
  this.cdRef.detectChanges(); 
}

onRowEditSave(egreso: any, index: number) {
  //this.agregarFilaVacia();
  this.egresos[index].editing = false;
}

onRowEditCancel(egreso: any, index: number) {
  egreso.editing = false;
}

confirmarGuardado(event: Event) {
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: '¿Estás seguro de que deseas guardar todos los egresos?',
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
      this.guardarTodosLosEgresos();
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelado',
        detail: 'No se guardaron los egresos',
      });
    },
  });
}

guardarTodosLosEgresos() {
  const cod_area = this.areaSeleccionada?.cod_area;
  const egresosAGuardar = this.egresos
  .filter((egr) => egr.cod_insumo && egr !== this.filaEditable)
  .map((egr) => ({
    ...egr,
    cod_area
  }));

  if (egresosAGuardar.length === 0) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay egresos para guardar' });
    return;
  }

  if (!this.areaSeleccionada){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un área' });
    return;
  }

  const egresosFormateados = egresosAGuardar.map((egr) => {
    if (egr.fecha_vencimiento instanceof Date) {
      const yyyy = egr.fecha_vencimiento.getFullYear();
      const mm = String(egr.fecha_vencimiento.getMonth() + 1).padStart(2, '0');
      const dd = String(egr.fecha_vencimiento.getDate()).padStart(2, '0');
      egr.fecha_vencimiento = `${yyyy}-${mm}-${dd}`;
    }

    return {
      ...egr,
      cod_presentacion: egr.presentacion?.cod_presentacion || null,
      cod_lote: egr.lote_seleccionado?.cod_lote || null,
      cantidad: egr.cantidad_ingresada || 0,
    }
  })

  

  this.egresosService.createMultipleEgresos({
    realizado_por: this.nombreUsuario,
    egresos: egresosFormateados
  }).subscribe({
    next: (res) => {
      console.log(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Guardado',
        detail: 'Egresos guardados correctamente en la base de datos',
      });
      this.egresos = [this.crearFilaEditable()]; 
      this.areaSeleccionada = null;
      
    },
    error: (err) => {
      console.error('Error al guardar egresos:', err);
      alert('Hubo un error al guardar los egresos');
    }
  });
}


agregarFilaVacia(){
  const nuevaFila = {
    linea: this.contadorLinea++,
    cod_insumo: '',
    insumo: '',
    cod_presentacion: '',
    presentacionesDisponibles: [],
    cod_lote: '',
    fecha_vencimiento: '',
    cod_area: '',
    cantidad: 0,
    observaciones: ''
  };

  this.egresos.push(nuevaFila);
  this.cdRef.detectChanges();
}

onGuardarEgreso(){
  if (!this.filaEditable.cod_insumo){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El código del insumo no puede estar vacío' });
    return;
  } 

  if (!this.filaEditable.presentacion || !this.filaEditable.presentacion.nombre?.trim()){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una presentación' });
    return;
  }

  if (!this.filaEditable.lote_seleccionado){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un lote' });
    return;
  }



  if (
    this.filaEditable.cantidad_ingresada === null ||
    this.filaEditable.cantidad_ingresada === undefined ||
    this.filaEditable.cantidad_ingresada === '' ||
    +this.filaEditable.cantidad_ingresada <= 0
  ) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe ingresar una cantidad válida mayor a cero.',
    });
    return;
  }

  const cantidad = Number(this.filaEditable.cantidad_ingresada);
  const disponible = Number(this.filaEditable.cantidad_disponible);
  if (cantidad > disponible) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `La cantidad a egresar no puede ser mayor a la cantidad disponible (${this.filaEditable.cantidad_disponible}).`,
    });
    // Resetear la cantidad a 0 o null para que el usuario corrija
    this.filaEditable.cantidad_ingresada = disponible;
    this.cdRef.detectChanges();
    return;
  }

  const egresoNuevo = {
    ...this.filaEditable,
    linea: this.contadorLinea++,
  };

  this.egresos.push(egresoNuevo);
  this.filaEditable = this.crearFilaEditable();
  this.cdRef.detectChanges();
}

getColorClase(fechaVencimiento: string | Date): string {
  const hoy = new Date();
  const fecha = new Date(fechaVencimiento);
  const dias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

  if (dias < 90) {
    return 'bg-red-500';        // menor a 3 meses → rojo
  } else if (dias <= 180) {
    return 'bg-yellow-500';     // entre 3 y 6 meses → amarillo
  } else {
    return 'bg-green-500';      // mayor a 6 meses → verde
  }
}

eliminarEgreso(index: number) {
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas eliminar este egreso?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.egresos.splice(index, 1);
      this.cdRef.detectChanges();
      this.messageService.add({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'Egreso eliminado correctamente'
      });
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Cancelado',
        detail: 'No se eliminó el egreso'
      });
    }
  });
}

justificarLote(){
    this.mostrarDialogJustificacion = true;
}

guardarJustificacion(){
  if (this.justificacionTexto && this.justificacionTexto.trim() !== '') {
    // Si la fila actual está en edición, asignamos la justificación como observación
    this.filaEditable.observaciones = this.justificacionTexto.trim();
    this.cdRef.detectChanges();
    console.log('Observación guardada:', this.filaEditable.observaciones);
  }
  this.mostrarDialogJustificacion = false;
  this.justificacionTexto = ''; // Limpiamos el campo
}

}
