import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'logs',
    loadComponent: () =>
      import('./pages/logs/logs.component').then((m) => m.LogsComponent),
  },
  {
    path: 'equipment',
    loadComponent: () =>
      import('./pages/equipment/equipment.component').then(
        (m) => m.EquipmentComponent
      ),
  },
];
