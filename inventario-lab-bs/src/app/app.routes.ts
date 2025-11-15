import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AppLayout } from './layout/component/app.layout';
import { IngresosComponent } from './components/transacciones/ingresos/ingresos.component';
import { RequisicionesTemporalesComponent } from './components/transacciones/requisiciones-temporales/requisiciones-temporales.component';
import { PresentacionesComponent } from './components/mantenimiento/presentaciones/presentaciones.component';
import { InsumosComponent } from './components/mantenimiento/insumos/insumos.component';
import { AreasDestinosComponent } from './components/mantenimiento/areas-destinos/areas-destinos.component';
import { EgresosComponent } from './components/transacciones/egresos/egresos.component';
import { KardexPrincipalComponent } from './components/reportes/stock/stock.component';
import { ExistenciasConsumosComponent } from './components/reportes/existencias-consumos/existencias-consumos.component';
import { BalanceComponent } from './components/reportes/balance/balance.component';
import { HistorialComponent } from './components/historial/historial.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent, 
      },
    {
        path: '',
        component:AppLayout,
        canActivate: [authGuard],
        children:[
            { path: 'dashboard', component: DashboardComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard]   },
            { path: 'ingresos', component: IngresosComponent, data: { roles: ['Administrador'] }, canActivate: [RoleGuard] },
            { path: 'requisiciones-temporales', component: RequisicionesTemporalesComponent, data: { roles: ['Administrador'] }, canActivate: [RoleGuard] },
            { path: 'egresos', component: EgresosComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'historial', component: HistorialComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'presentaciones', component: PresentacionesComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'insumos', component: InsumosComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'ubicaciones', component: AreasDestinosComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'reportes/stockPrincipal', component: KardexPrincipalComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'reportes/existenciasConsumos', component: ExistenciasConsumosComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'reportes/balanceStock', component: BalanceComponent, data: { roles: ['Administrador', "Invitado"] }, canActivate: [RoleGuard] },
            { path: 'usuarios', component: UsuariosComponent, data: { roles: ['Administrador'] }, canActivate: [RoleGuard]}
        ]
    },
    { path: '**', redirectTo: 'login'}
];
