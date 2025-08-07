import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { MypageComponent } from './core/components/pages/mypage/mypage.component';
import { IngresosComponent } from './components/transacciones/ingresos/ingresos.component';
import { RequisicionesTemporalesComponent } from './components/transacciones/requisiciones-temporales/requisiciones-temporales.component';
import { PresentacionesComponent } from './components/mantenimiento/presentaciones/presentaciones.component';
import { InsumosComponent } from './components/mantenimiento/insumos/insumos.component';
import { AreasDestinosComponent } from './components/mantenimiento/areas-destinos/areas-destinos.component';
import { EgresosComponent } from './components/transacciones/egresos/egresos.component';
import { KardexPrincipalComponent } from './components/reportes/stock/stock.component';
import { ExistenciasConsumosComponent } from './components/reportes/existencias-consumos/existencias-consumos.component';
import { HistorialComponent } from './components/historial/historial.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent, 
      },
    {
        path: '',
        component:AppLayout,
        children:[
            { path: '', component: DashboardComponent },
            { path: 'ingresos', component: IngresosComponent },
            { path: 'requisiciones-temporales', component: RequisicionesTemporalesComponent },
            { path: 'egresos', component: EgresosComponent },
            { path: 'historial', component: HistorialComponent },
            { path: 'presentaciones', component: PresentacionesComponent },
            { path: 'insumos', component: InsumosComponent },
            { path: 'ubicaciones', component: AreasDestinosComponent },
            { path: 'reportes/stockPrincipal', component: KardexPrincipalComponent },
            { path: 'reportes/existenciasConsumos', component: ExistenciasConsumosComponent },
        ]
    },
    { path: '**', redirectTo: 'login'}
];
