import { Injectable } from '@angular/core';
import { Storage } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage | null = null;

  constructor() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.storage = localStorage;
    } catch (e) {
      console.warn('LocalStorage is not available. Using in-memory storage.');
      this.storage = {
        getItem: (key: string) => null,
        setItem: (key: string, value: any) => {},
        removeItem: (key: string) => {},
      };
    }
  }

  setItem(key: string, value: any): void {
    this.storage?.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = this.storage?.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    this.storage?.removeItem(key);
  }
}
