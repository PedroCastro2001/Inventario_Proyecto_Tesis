import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService} from 'primeng/api';
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
import { AreaService } from '../../../services/area.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ChangeDetectorRef } from '@angular/core';

interface expandedRows {
  [key: string]: boolean;
}
interface Area {
  name: string;
  original?: Area; 
}

@Component({
  selector: 'app-areas-destinos',
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
    ConfirmDialog
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './areas-destinos.component.html',
  styleUrl: './areas-destinos.component.css'
})
export class AreasDestinosComponent implements OnInit {
  statuses: any[] = [];
  rowGroupMetadata: any;
  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  loading: boolean = false;
  autoFilteredValue: any[] = [];
  areas: any[] = [];


  name: string = '';

  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dt1') dt1!: Table; 

  constructor(
    private messageService: MessageService,
    private areasService: AreaService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ){}

  nombre: string = '';
  filaEditando: any = null;
  nombreOriginal: string = '';

  ngOnInit() {
    this.nombre = '';

    this.areasService.getAreas().subscribe((areas) => {
      this.areas = areas;
    })

  }

guardarArea() {
  const area = {
    nombre: this.nombre
  }

  if (!area.nombre.trim()) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre no puede estar vacío' });
    return;
  }

  this.areasService.createArea(area).subscribe((response: any) => {
    console.log('Área guardada con éxito:', response);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Área guardada con éxito' });
    this.ngOnInit();
  }, error => {
    console.error('Error al guardar el área:', error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el área' });
  })
};

editarFila(rowData: any){
  this.filaEditando = rowData;
  this.nombreOriginal = rowData.nombre;
}

guardarEdicion(rowData: any) {
  this.messageService.add({ severity: 'success', summary: 'Editado', detail: 'Área actualizada correctamente.' });
  this.filaEditando = null;
}

cancelarEdicion(rowData: any) {
  rowData.nombre = this.nombreOriginal; 
  this.filaEditando = null;
}

eliminarFila(event: Event, rowData: any) {
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: '¿Estás seguro de que deseas eliminar esta área?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.areasService.deleteArea(rowData.cod_area).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Área eliminada correctamente.' });
          this.areas = this.areas.filter(area => area.cod_area !== rowData.cod_area);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el área.' });
        }
      );
    }
  });
}

onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

clear(table: Table) {
  table.clear();
  this.filter.nativeElement.value = '';
}

onRowEditInit(item: Area) {
  // Se guarda una copia original por si se cancela la edición
  item['original'] = { ...item };
}

onRowEditSave(item: any) {
  if (!item.nombre.trim()) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre no puede estar vacío' });
    return;
  }

  this.areasService.updateArea(item.cod_area, { nombre: item.nombre }).subscribe(
    (response) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Área actualizada correctamente.' });
      this.filaEditando = null;
    },
    (error) => {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el área.' });
    }
  );
}
}
