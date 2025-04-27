import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { MypageComponent } from './core/components/pages/mypage/mypage.component';
import { IngresosComponent } from './components/transacciones/ingresos/ingresos.component';
import { PresentacionesComponent } from './components/mantenimiento/presentaciones/presentaciones.component';
import { InsumosComponent } from './components/mantenimiento/insumos/insumos.component';
import { AreasDestinosComponent } from './components/mantenimiento/areas-destinos/areas-destinos.component';
import { EgresosComponent } from './components/transacciones/egresos/egresos.component';

export const routes: Routes = [
    {
        path: '',
        component:AppLayout,
        children:[
            { path: '', component:MypageComponent},
            { path: 'ingresos', component: IngresosComponent},
            { path: 'egresos', component: EgresosComponent},
            { path: 'presentaciones', component: PresentacionesComponent},
            { path: 'insumos', component: InsumosComponent},
            { path: 'ubicaciones', component: AreasDestinosComponent}
        ]
    }
];
