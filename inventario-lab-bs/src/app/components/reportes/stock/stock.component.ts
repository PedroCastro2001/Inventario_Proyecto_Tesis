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
    this.consultarResumenStock();
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

}
