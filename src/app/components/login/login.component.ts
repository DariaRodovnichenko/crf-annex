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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .login(email!, password!)
        .then(() => {
          console.log('✅ Logged in!');
        })
        .catch((err) => {
          this.error = err.message;
        });
    }
  }

  onLogout(): void {
    this.authService.logout().then(() => {
      console.log('👋 Logged out!');
      this.router.navigate(['/']);
    });
  }
}
