import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { addIcons } from 'ionicons';
import {
  list,
  person,
  logOut,
  heart,
  camera,
  flask,
  cash,
  apps,
  swapHorizontal,
  home,
  timer,
  settings,
  documentText,
  statsChart,
  trashOutline,
  addOutline,
} from 'ionicons/icons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

addIcons({
  list,
  person,
  home,
  timer,
  settings,
  'add-outline': addOutline,
  'document-text': documentText,
  'stats-chart': statsChart,
  'trash-outline': trashOutline,
  logOut,
  heart,
  camera,
  flask,
  cash,
  apps,
  swapHorizontal,
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

defineCustomElements(window);
