import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptService {

  constructor() { }

  /**
   *  Encripta un texto
   * Nota: se usa btoa() para encriptar actualmente
   * @param text texto a encriptar
   * @returns texto encriptado
   */
  encrypt(text: string): string {
    return btoa(text);
  }

  /**
   * Desencripta un texto
   * Nota: se usa atob() para desencriptar actualmente
   * @param text texto a desencriptar
   * @returns texto desencriptado
   */
  decrypt(text: string | null): string {
    return text ? atob(text) : "";
  }

  encryptSha256(word: string): string | void {
    throw (new Error('Method not implemented.'));
  }
}
