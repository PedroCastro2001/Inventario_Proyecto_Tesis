import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    userRole: string | null = null;

    ngOnInit() {
        this.userRole = localStorage.getItem("rol");
        if (this.userRole === 'Administrador'){
            this.model = [
                {
                    label: 'Inicio',
                    items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
                },
                {
                    label: 'Gestión de Insumos',
                    items: [
                        {
                            label: 'Mantenimientos',
                            icon: 'pi pi-cog',
                            items: [
                                {
                                    label: 'Áreas',
                                    icon: 'pi pi-map-marker',
                                    routerLink: ['/ubicaciones']
                                },
                                {
                                    label: 'Insumos',
                                    icon: 'pi pi-tag',
                                    routerLink: ['/insumos']
                                }
                            ]
                        },
                        {
                            label: 'Transacciones',
                            icon: 'pi pi-sort-alt-slash',
                            items: [
                                {
                                    label: 'Registrar ingreso',
                                    icon: 'pi pi-inbox',
                                    routerLink: ['/ingresos']
                                },
                                {
                                    label: 'Registrar egreso',
                                    icon: 'pi pi-sign-out',
                                    routerLink: ['/egresos']
                                },
                                {
                                    label: 'Requisiciones pendientes',
                                    icon: 'pi pi-file-edit',
                                    routerLink: ['/requisiciones-temporales']
                                },
                                {
                                    label: 'Historial de movimientos',
                                    icon: 'pi pi-history',
                                    routerLink: ['/historial']
                                },
                            ]
                        },
                        {
                            label: 'Reportes',
                            icon: 'pi pi-book',
                            items: [
                                {
                                    label: 'Stock de Insumos',
                                    icon: 'pi pi-file-excel',
                                    routerLink: ['/reportes/stockPrincipal']
                                },
                                {
                                    label: 'Balance de Stock',
                                    icon: 'pi pi-table',
                                    routerLink: ['/reportes/balanceStock']
                                },
                            ]
                        },
                        {
                            label: 'Administración',
                            icon: 'pi pi-check-square',
                            items: [
                                {
                                    label: 'Usuarios',
                                    icon: 'pi pi-user',
                                    routerLink: ['/usuarios']
                                },
                            ]
                        }
                    ]
                },
            ];
        } else if (this.userRole === 'Invitado'){
            this.model = [
                {
                    label: 'Gestión de Insumos',
                    items: [
                        {
                            label: 'Transacciones',
                            icon: 'pi pi-sort-alt-slash',
                            items: [
                                {
                                    label: 'Registrar egreso',
                                    icon: 'pi pi-sign-out',
                                    routerLink: ['/egresos']
                                },
                                {
                                    label: 'Historial de movimientos',
                                    icon: 'pi pi-history',
                                    routerLink: ['/historial']
                                },
                            ]
                        },
                    ]
                },
            ];
        }
        
    }
}
