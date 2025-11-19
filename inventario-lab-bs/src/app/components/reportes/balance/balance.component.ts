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

interface BalanceItem {
  cod_insumo: string;
  insumo: string;
  presentacion?: string;
  tipo: 'Ingreso' | 'Egreso' | 'Saldo inicial' | string;
  no_requisicion?: string;
  fecha_transaccion?: string;
  cantidad?: number;
  fecha_vencimiento?: string;
  lote?: string;
  saldo?: number;
}

@Component({
  selector: 'app-balance',
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
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css'
})
export class BalanceComponent implements OnInit {
  desdeFecha: Date | null = null;
  hastaFecha: Date | null = null;
  balanceData: any[] = [];
  filterActive: boolean = false;

  constructor(private kardexService: KardexService) { }

  ngOnInit(): void {
    this.desdeFecha = new Date();
    this.hastaFecha = new Date();
    //this.consultarBalance();
  }

  consultarBalance() {  
    if (!this.hastaFecha || !this.desdeFecha) {
      return;
    }

    const fechaFormateadaInicio = this.desdeFecha.toISOString().split('T')[0];
    const fechaFormateadaFin = this.hastaFecha.toISOString().split('T')[0];

    this.kardexService.getBalanceStock(fechaFormateadaInicio, fechaFormateadaFin).subscribe({
      next: (data) => {
        this.balanceData = data;
      },
      error: (err) => {
        console.error('Error al consultar el balance:', err);
      }
    });
  }

  onGlobalFilter(event: Event, table: Table) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
    this.filterActive = input.value.trim().length > 0;
  }

  isFirstOfPresentation(index: number): boolean {
  if (this.filterActive) return true; // nunca hacemos rowspan cuando hay filtro

  if (index === 0) return true;
  const current = this.balanceData[index];
  const previous = this.balanceData[index - 1];
  return current.presentacion !== previous.presentacion || current.cod_insumo !== previous.cod_insumo;
  }

  getPresentationRowspan(item: any): number {
    if (this.filterActive) return 1; // no aplicamos rowspan cuando hay filtro
    let count = 0;
    for (let i = this.balanceData.indexOf(item); i < this.balanceData.length; i++) {
      if (this.balanceData[i].presentacion === item.presentacion &&
          this.balanceData[i].cod_insumo === item.cod_insumo) {
        count++;
      } else {
        break;
      }
    }
    return count;
  } 

  imprimirBalance() {
  if (!this.balanceData || this.balanceData.length === 0) {
    alert('No hay datos para imprimir.');
    return;
  }

  // Generar texto del periodo
  let periodoTexto = '';
  if (this.desdeFecha && this.hastaFecha) {
    periodoTexto = `Periodo: ${new Date(this.desdeFecha).toLocaleDateString()} al ${new Date(this.hastaFecha).toLocaleDateString()}`;
  } else if (this.desdeFecha) {
    periodoTexto = `Desde: ${new Date(this.desdeFecha).toLocaleDateString()}`;
  } else if (this.hastaFecha) {
    periodoTexto = `Hasta: ${new Date(this.hastaFecha).toLocaleDateString()}`;
  }

  // Agrupar por código + insumo, y luego por presentación
  const grupos: Record<string, Record<string, BalanceItem[]>> = {};
  this.balanceData.forEach((item: BalanceItem) => {
    const key = `${item.cod_insumo}|${item.insumo}`;
    if (!grupos[key]) grupos[key] = {};
    const presKey = item.presentacion || '-';
    if (!grupos[key][presKey]) grupos[key][presKey] = [];
    grupos[key][presKey].push(item);
  });

    const contenido = `
      <html>
        <head>
          <title>Imprimir Balance</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }

            .encabezado {
              width: 100%;
              margin-bottom: 20px;
            }

            .linea {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            }

            .linea-izquierda img {
              width: 80px;
            }

            .linea-centro {
              text-align: center;
              flex: 1;
            }

            .linea-centro .hospital {
              font-weight: bold;
              font-size: 14px;
            }

            .linea-centro .anexo {
              font-weight: bold;
              font-size: 14px;
            }

            .linea-centro .control {
              font-weight: normal;
              font-size: 12px;
              margin-top: 5px;
            }

            .periodo {
              text-align: center;
              font-size: 12px;
              margin-bottom: 15px;
              margin-top: 15px;
            }

            .linea-derecha {
              text-align: right;
              font-size: 10px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 2px;
            }

            .linea-derecha div {
              display: flex;
              gap: 5px;
            }

            h1 {
              text-align: center;
              color: #0369a1;
              font-size: 24px;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px; 
            }

            th, td {
              border: 1px solid #ccc;
              padding: 4px;
              text-align: center;
            }

            th {
              background-color: #f5f5f5;
            }

            .tag-ingreso {
              background-color: #d1fae5;
              color: #065f46;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
            }

            .tag-egreso {
              background-color: #fef3c7;
              color: #78350f;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
            }

            .tag-saldo {
              background-color: #dbeafe;
              color: #155a76ff;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
            }
          </style>
        </head>
        <body>
          <div class="encabezado">
            <div class="linea">
              <div class="linea-izquierda">
                <img  src="https://pbs.twimg.com/profile_images/1085895369873997824/jbNZ9Fr2_400x400.png" alt="Mi Logo" alt="Logo" />
              </div>
              <div class="linea-centro">
                <div class="hospital">HOSPITAL NACIONAL DE ESPECIALIDADES QUIRÚRGICAS DE VILLA NUEVA</div>
                <div class="anexo">ANEXO 2</div>
                <div class="control">CONTROL INTERNO DE INSUMOS - ${localStorage.getItem('contexto')?.toUpperCase()}</div>
                ${periodoTexto ? `<div class="periodo">${periodoTexto}</div>` : ''}
              </div>
              <div class="linea-derecha">
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Código Insumo</th>
                <th>Insumo</th>
                <th>Presentación</th>
                <th>Tipo</th>
                <th>No requisición</th>
                <th>Fecha transacción</th>
                <th>Cantidad</th>
                <th>Fecha vencimiento</th>
                <th>Lote</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(grupos)
                .map(([key, presGrupos]) => {
                  const [cod_insumo, insumo] = key.split('|');
                  return Object.entries(presGrupos)
                    .map(([presentacion, items]) => {
                      return items.map((item, index) => `
                        <tr>
                          ${index === 0 && presentacion === Object.keys(presGrupos)[0] ? `<td rowspan="${Object.values(presGrupos).reduce((a,b)=>a+b.length,0)}">${cod_insumo}</td>` : ''}
                          ${index === 0 && presentacion === Object.keys(presGrupos)[0] ? `<td rowspan="${Object.values(presGrupos).reduce((a,b)=>a+b.length,0)}">${insumo}</td>` : ''}
                          ${index === 0 ? `<td rowspan="${items.length}">${presentacion}</td>` : ''}
                          <td>
                            <span class="${
                              item.tipo === 'Ingreso' ? 'tag-ingreso' :
                              item.tipo === 'Egreso' ? 'tag-egreso' :
                              item.tipo === 'S. Inicial' ? 'tag-saldo' : ''
                            }">${item.tipo}</span>
                          </td>
                          <td>${item.no_requisicion || '-'}</td>
                          <td>${item.fecha_transaccion ? new Date(item.fecha_transaccion).toLocaleDateString() : '-'}</td>
                          <td>${item.cantidad ?? '-'}</td>
                          <td>${item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString() : '-'}</td>
                          <td>${item.lote || '-'}</td>
                          <td>${item.saldo ?? '-'}</td>
                        </tr>
                      `).join('');
                    }).join('');
                }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;


    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(contenido);
      doc.close();
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }

    setTimeout(() => document.body.removeChild(iframe), 1000);
  }
}
