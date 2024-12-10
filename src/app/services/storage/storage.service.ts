import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Storage } from '../../models/models';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        this.storage = localStorage;
      } catch (e) {
        console.warn('LocalStorage is not available. Using in-memory storage.');
        this.storage = this.createInMemoryStorage();
      }
    } else {
      console.warn('Server-side rendering detected. Using in-memory storage.');
      this.storage = this.createInMemoryStorage();
    }
  }

  private createInMemoryStorage(): {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  } {
    const memoryStorage: { [key: string]: string } = {};
    return {
      getItem: (key: string) => memoryStorage[key] || null,
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete memoryStorage[key];
      },
    };
  }

  setItem(key: string, value: any): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage?.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage?.removeItem(key);
    } catch (e) {
      console.error('Error removing from storage:', e);
    }
  }

  clear(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.clear();
      } else {
        const memoryStorage = this.storage as { [key: string]: any };
        for (const key in memoryStorage) {
          if (memoryStorage.hasOwnProperty(key)) {
            delete memoryStorage[key];
          }
        }
      }
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  }
}
