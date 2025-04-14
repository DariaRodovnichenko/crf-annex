import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable, firstValueFrom } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { BottomToolbarComponent } from '../bottom-toolbar/bottom-toolbar.component';
import { IonButton, IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonList, IonText } from '@ionic/angular/standalone';

const UIElements = [
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonButton
]

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, BottomToolbarComponent, ...UIElements],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  error = '';
  authState$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.authState$ = this.authService.authState$;
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    try {
      const user = await firstValueFrom(this.authState$);

      if (user?.isAnonymous) {
        // Upgrade guest
        await this.authService.upgradeAnonymousAccount(email!, password!);
        console.log('✨ Anonymous account upgraded');
      } else {
        // Normal login
        await this.authService.login(email!, password!);
        console.log('✅ Logged in as registered user');
      }

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.message || 'Something went wrong. Please try again.';
      console.error('❌ Login/Upgrade failed:', err);
    }
  }

  onLogout(): void {
    this.authService.logout().then(() => {
      console.log('👋 Logged out!');
      this.router.navigate(['/']);
    });
  }
}
