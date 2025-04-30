import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../data/database.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TDSService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);

  async saveTDSValue(value: number, yieldVal: number): Promise<void> {
    const entry = {
      value,
      yield: yieldVal,
      timestamp: new Date().toISOString(),
    };

    const user = await this.auth.getCurrentUser();
    if (user?.isAnonymous) {
      const existing = JSON.parse(localStorage.getItem('guestTDS') || '[]');
      existing.push(entry);
      localStorage.setItem('guestTDS', JSON.stringify(existing));
      console.log('💾 TDS saved locally for guest');
    } else if (user) {
      await this.db.pushData(`users/${user.uid}/TDSValues`, entry);
      console.log('✅ TDS value saved to Firebase');
    }
  }
}
