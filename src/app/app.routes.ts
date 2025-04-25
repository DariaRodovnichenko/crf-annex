import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogsComponent } from './pages/logs/logs.component';
import { MoreComponent } from './pages/more/more.component';
import { VisualsComponent } from './pages/visuals/visuals.component';
import { TimerComponent } from './pages/timer/timer.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { TDSScanComponent } from './pages/tds-scan/tds-scan.component';
import { GrinderComponent } from './pages/grinder/grinder.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RecipesComponent } from './pages/recipes/recipes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: '🏠 Home' } },
  { path: 'login', component: LoginComponent, data: { title: '🔐 Login' } },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: '🧪 Extraction Analysis' },
  },
  { path: 'logs', component: LogsComponent, data: { title: '📘 Brew Logs' } },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'converter',
    component: GrinderComponent,
    data: { title: '⚖️ Grinder Converter' },
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    data: { title: '💰 Expenses' },
  },
  {
    path: 'more',
    component: MoreComponent,
    data: { title: '✨ More Features' },
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    data: { title: '❤️ Saved Recipes' },
  },
  {
    path: 'visuals',
    component: VisualsComponent,
    data: { title: '📊 Brew Visuals' },
  },
  {
    path: 'timer',
    component: TimerComponent,
    data: { title: '⏱ Brewing Timer' },
  },
  {
    path: 'tds-scan',
    component: TDSScanComponent,
    data: { title: '📷 Scan TDS' },
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    data: { title: '📝 Recipes' },
  },
  { path: '**', redirectTo: '' },
];
