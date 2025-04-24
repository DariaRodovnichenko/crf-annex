import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../data/database.service';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';

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

    const user = await firstValueFrom(this.auth.authState$);
    if (user?.isAnonymous) {
      const existing = JSON.parse(
        localStorage.getItem('guest-tds-values') || '[]'
      );
      existing.push(entry);
      localStorage.setItem('guest-tds-values', JSON.stringify(existing));
      console.log('💾 TDS saved locally for guest');
    } else if (user) {
      await this.db.pushData(`users/${user.uid}/TDSValues`, entry);
      console.log('✅ TDS value saved to Firebase');
    }
  }
}
