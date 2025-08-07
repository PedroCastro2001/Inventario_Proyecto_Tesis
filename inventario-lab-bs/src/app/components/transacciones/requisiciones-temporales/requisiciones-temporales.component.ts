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

@Component({
  selector: 'app-requisiciones-temporales',
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
  templateUrl: './requisiciones-temporales.component.html',
  styleUrl: './requisiciones-temporales.component.css'

})

export class RequisicionesTemporalesComponent implements OnInit {
  requisicionesTemp: any[] = [];
  loading: boolean = false;
  filaEditando: any = null;
  tempNoRequisicion: string = '';
  no_requisicion: string = '';

  constructor(
    private ingresosService: IngresosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.ingresosService.getIngresosReqTemporal().subscribe(
      (data) => {
        this.requisicionesTemp = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las requisiciones pendientes' });
        this.loading = false;
      }
    );
  }
  
  editarFila(reqTemporal: any){
  this.filaEditando = reqTemporal;
  this.tempNoRequisicion = reqTemporal.no_requisicion;
}

guardarEdicion(reqTemporal: any, event: Event) {
    this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: '¿Estás seguro de que deseas guardar los cambios?',
    header: 'Confirmación',
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
          this.actualizarNoRequisicion(reqTemporal.no_requisicion);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se guardaron los cambios.',
        });
        this.cancelarEdicion(reqTemporal);
      },
    });
}

cancelarEdicion(reqTemporal: any) {
  reqTemporal.no_requisicion = this.tempNoRequisicion;
  this.filaEditando = null;
}

actualizarNoRequisicion(newNoRequisicion: string) {
  console.log(this.tempNoRequisicion);
  console.log(this.no_requisicion);
  this.ingresosService.updateNoRequisicion(this.tempNoRequisicion, newNoRequisicion).subscribe({
    next: (response) => {
      console.log('Número de requisición actualizado:', response);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Número de requisición actualizado correctamente' });
      this.ngOnInit();
    },
    error: (error) => {
      console.error('Error al actualizar el número de requisición:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el número de requisición' });
      this.filaEditando = null;
    }
  });  
}

}
