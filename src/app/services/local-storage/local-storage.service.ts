import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  async save(key: string, data: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(data),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await Preferences.get({ key });
    return result.value ? JSON.parse(result.value) : null;
  }

  async pushToArray<T>(key: string, item: T): Promise<void> {
    const existing = (await this.get<T[]>(key)) || [];
    existing.push(item);
    await this.save(key, existing);
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
