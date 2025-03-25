import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogsComponent } from './pages/logs/logs.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';
import { MoreComponent } from './pages/more/more.component';
import { VisualsComponent } from './pages/visuals/visuals.component';
import { TimerComponent } from './pages/timer/timer.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { TdsScanComponent } from './pages/tds-scan/tds-scan.component';
import { GrinderComponent } from './pages/grinder/grinder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'equipment', component: EquipmentComponent },
  {
    path: 'converter', component: GrinderComponent
  },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'more', component: MoreComponent },
  { path: 'favorites', component: RecipesComponent },
  { path: 'visuals', component: VisualsComponent },
  { path: 'timer', component: TimerComponent },
  { path: 'tds-scan', component: TdsScanComponent },
  { path: '**', redirectTo: '' },
];
