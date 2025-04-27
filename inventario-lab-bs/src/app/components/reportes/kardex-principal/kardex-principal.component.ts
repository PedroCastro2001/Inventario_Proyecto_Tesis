import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';

import { KardexService } from '../../../services/kardex.service';

@Component({
  selector: 'app-kardex-principal',
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    Tag
  ],
  templateUrl: './kardex-principal.component.html',
  styleUrl: './kardex-principal.component.css'
})
export class KardexPrincipalComponent implements OnInit {

  kardexData: any[] = [];

  constructor(private kardexService: KardexService) {}

  ngOnInit(): void {
    this.kardexService.getReporteKardex().subscribe({
      next: (data) => {
        this.kardexData = data;
        console.log('Datos del Kardex:', this.kardexData);
      },
      error: (err) => {
        console.error('Error al obtener reporte de Kardex', err);
      }
    });
  }

}
