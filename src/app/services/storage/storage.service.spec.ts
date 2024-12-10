import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { PLATFORM_ID } from '@angular/core';

describe('StorageService', () => {
  let service: StorageService;

  const mockStorage = () => {
    const storage: { [key: string]: string } = {};
    return {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((key) => delete storage[key]);
      },
      length: 0,
      key: (index: number) => '',
    };
  };

  describe('Browser Environment', () => {
    beforeEach(() => {
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', { value: mockStorage() });

      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      });
      service = TestBed.inject(StorageService);
    });

    it('should store and retrieve data', () => {
      const testData = { test: 'value' };
      service.setItem('testKey', testData);
      expect(service.getItem('testKey')).toEqual(testData);
    });

    it('should handle null values', () => {
      service.setItem('testKey', null);
      expect(service.getItem('testKey')).toBeNull();
    });

    it('should remove items', () => {
      const testData = { test: 'value' };
      service.setItem('testKey', testData);
      service.removeItem('testKey');
      expect(service.getItem('testKey')).toBeNull();
    });

    it('should clear all items', () => {
      service.setItem('key1', 'value1');
      service.setItem('key2', 'value2');
      service.clear();
      expect(service.getItem('key1')).toBeNull();
      expect(service.getItem('key2')).toBeNull();
    });
  });

  describe('Server Environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      service = TestBed.inject(StorageService);
    });

    it('should use in-memory storage', () => {
      const testData = { test: 'value' };
      service.setItem('testKey', testData);
      expect(service.getItem('testKey')).toEqual(testData);
    });

    it('should handle storage operations', () => {
      service.setItem('key1', 'value1');
      service.setItem('key2', 'value2');
      expect(service.getItem('key1')).toBe('value1');
      service.removeItem('key1');
      expect(service.getItem('key1')).toBeNull();
      service.clear();
      expect(service.getItem('key2')).toBeNull();
    });
  });
});
