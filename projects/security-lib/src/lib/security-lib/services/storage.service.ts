import { Injectable } from '@angular/core';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private crypt: CryptService) { }

  setLocalStorage(key: string, value: string): void {
    const encryptedValue = this.crypt.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  getLocalStorage(key: string): string | null {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      return this.crypt.decrypt(encryptedValue); // Si se guarda cifrado, lo desencriptamos aquí.
    }
    return null;
  }
  setSessionStorage(key: string, value: string): void {
    const encryptedValue = this.crypt.encrypt(value);
    sessionStorage.setItem(key, encryptedValue);
  }

  getSessionStorage(key: string): string | null {
    const encryptedValue = sessionStorage.getItem(key);
    if (encryptedValue) {
      return this.crypt.decrypt(encryptedValue); // Si se guarda cifrado, lo desencriptamos aquí.
    }
    return null;
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
  clearSessionStorage(): void {
    sessionStorage.clear();
  }
}


