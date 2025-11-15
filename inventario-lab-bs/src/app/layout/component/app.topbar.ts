import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../services/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-topbar',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ConfirmDialog,],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="https://pbs.twimg.com/profile_images/1085895369873997824/jbNZ9Fr2_400x400.png" alt="Mi Logo" alt="Logo" style="width: 50px; height: auto;"/>
                
                <span
                    class="
                        text-sky-800 
                        dark:text-surface-0 
                        text-base
                        font-medium
                        font-sans
                        font-semibold
                        uppercase
                        whitespace-nowrap
                        leading-none
                    "
                >
                    CONTROL INTERNO DE INSUMOS - {{ contexto }}
                </span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <app-configurator />
                </div>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="confirmLogout($event)">
                        <i class="pi pi-sign-out"></i>
                        <span>Profile</span>
                        <p-confirmDialog></p-confirmDialog>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    contexto = localStorage.getItem('contexto') || '';

    constructor(
        public layoutService: LayoutService, 
        private authService: AuthService, 
        private router: Router, 
        private messageService: MessageService,
        private confirmationService: ConfirmationService

    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    confirmLogout(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro de que deseas cerrar sesión?',
            header: 'Confirmar cierre de sesión',
            icon: 'pi pi-check-circle',
            closable: true,
            closeOnEscape: true,
            rejectButtonProps: {
            label: 'No',
            severity: 'secondary',
            outlined: true,
            },
            acceptButtonProps: {
            label: 'Sí',
            severity: 'success',
            },
            accept: () => {
            this.logout();
            },
            reject: () => {
            
            },
        });
    }


}
