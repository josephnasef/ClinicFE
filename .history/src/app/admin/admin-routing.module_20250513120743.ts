import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CalendarComponent } from './Pages/Calander/Calendar.component';
import { MainComponent } from './Pages/Main/Main.component';
import { ServiceComponent } from './Pages/Service/Service.component';
import { ManageAppointmentComponent } from './Pages/manage-appointment/manage-appointment.component';
import { ShiftsComponent } from './Pages/Shifts/Shifts.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      {
        path: '', redirectTo: 'Main/manage-appointment', pathMatch: 'full' 
        // // children: [
        // //   // { path: 'manage-appointment', component: ManageAppointmentComponent },
        // //   // { path: 'doctor', loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule) },
        // //   // { path: 'service', component: ServiceComponent },
        // //   // { path: 'shifts', component: ShiftsComponent },
        // //   { path: '', redirectTo: 'Main/manage-appointment', pathMatch: 'full' },
        // ],
      },
      {
        path: 'Main', component: MainComponent,
        children: [
          { path: 'manage-appointment', component: ManageAppointmentComponent },
          { path: 'doctor', loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule) },
          { path: 'service', component: ServiceComponent },
          { path: 'shifts', component: ShiftsComponent },
          { path: '', redirectTo: 'manage-appointment', pathMatch: 'full' },
        ],
      },
      {
        path: 'Patient',
        loadChildren: () =>
          import('./modules/patient/patient.module').then(m => m.patientModule),
      },
      {
        path: 'Setting',
        loadChildren: () =>
          import('./modules/setting/setting.module').then(m => m.SettingModule),
      },
      {
        path: 'Doctors',
        loadChildren: () =>
          import('./modules/doctor/doctor.module').then(m => m.DoctorModule),
      },
      { path: 'Calendar', component: CalendarComponent },
      { path: 'Service', component: ServiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
