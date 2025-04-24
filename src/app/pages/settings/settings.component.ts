import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonLabel,
  IonItem,
  IonToggle,
  IonContent,
  IonAvatar,
  ModalController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import {
  getAuth,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

const UIElements = [
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToggle,
  IonAvatar,
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ...UIElements],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  username: string = '';
  password: string = '';
  newPassword: string = '';
  themeLight: boolean = false;
  avatarPreview: string | null = null;

  isGuest: boolean = false;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await firstValueFrom(this.authService.authState$);
    if (user) {
      this.username = user.displayName ?? '';
      this.avatarPreview = user.photoURL ?? this.generateDiceBearUrl();
      this.isGuest = user.isAnonymous;
    }

    this.themeLight = localStorage.getItem('theme') === 'light';
  }

  close() {
    this.modalCtrl.dismiss();
  }

  toggleTheme(event: CustomEvent) {
    this.themeLight = event.detail.checked;
    const newTheme = this.themeLight ? 'light' : 'dark';
    document.body.setAttribute('color-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  async saveUsername() {
    const user = getAuth().currentUser;
    if (user) {
      await updateProfile(user, { displayName: this.username });
      console.log('✅ Username updated!');
    }
  }

  async changePassword() {
    const user = getAuth().currentUser;
    if (!user?.email) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        this.password
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, this.newPassword);
      console.log('🔐 Password updated!');
    } catch (err) {
      console.error('❌ Password change failed', err);
    }
  }

  generateDiceBearUrl(): string {
    const seed = Math.random().toString(36).substring(2, 10);
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
  }

  useRandomAvatar() {
    this.avatarPreview = this.generateDiceBearUrl();
    console.log('🎲 New random avatar generated');
  }

  async saveAvatar() {
    const user = getAuth().currentUser;
    if (user && this.avatarPreview) {
      await updateProfile(user, { photoURL: this.avatarPreview });
      console.log('🖼️ Avatar updated!');
    }
  }

  async goToLogin() {
    await this.modalCtrl.dismiss();
    this.router.navigate(['/login']);
  }

  async logout() {
    await this.modalCtrl.dismiss();
    await this.authService.logout();
    console.log('🚪 Logged out from settings');
  }
}
