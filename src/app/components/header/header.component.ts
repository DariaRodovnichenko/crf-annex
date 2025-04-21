import { Component, inject } from '@angular/core';
import {
  NavigationEnd,
  RouterModule,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth/auth.service';
import { person, logOut } from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonLabel,
  IonToolbar,
  IonIcon,
  IonImg,
  IonTitle,
} from '@ionic/angular/standalone';
import { filter, map, startWith } from 'rxjs';

const UIElements = [
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonLabel,
  IonIcon,
  IonImg,
  IonTitle,
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ...UIElements],
 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authState$ = this.authService.authState$;

  // ✅ Icon SVGs
  personIcon = person;
  logoutIcon = logOut;

  // ✅ Observable for title, for use with `| async`
  pageTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => {
      let current = this.route;
      while (current.firstChild) {
        current = current.firstChild;
      }
      return current.snapshot.data?.['title'] || '';
    }),
    startWith('')
  );

  logout() {
    this.authService.logout();
  }
}
