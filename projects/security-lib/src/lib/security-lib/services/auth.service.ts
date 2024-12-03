import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { permissionOptions } from '../models/tokenModels';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private permissionsTree: any | null;

  private authStorageKey: string = "permissionsTree";

  private defaultOptions: any = {
    "denyAccess": true,
    "allowCreate": false,
    "allowRead": false,
    "allowUpdate": false,
    "allowDelete": false,
    "allowExport": false,
    "allowPrint": false
  }

  constructor(private storageService: StorageService) {
    // Ejemplo de permisos del usuario, podría venir desde un token o API
    this.permissionsTree = null;
  }

  /**
   * almacena  en local storage el arbol de permisos, además de formatearlo en la variable global del servicio
   * @param permissionsTree arbol de permisos
   */
  savePermissionsTree(permissionsTree:{ [key: string]: permissionOptions }) {
    this.permissionsTree = permissionsTree;
    this.storageService.setLocalStorage(this.authStorageKey, JSON.stringify(permissionsTree));
  }

  /**
   * Obtiene dede local storage el arbol de permisos y lo almacena en la variable global del servicio
   * @returns
   */
  getPermissionsTree(): { [key: string]: permissionOptions } | null {
    const permissionsTree = this.storageService.getLocalStorage(this.authStorageKey);
    if (permissionsTree) {
      return JSON.parse(permissionsTree);
    }
    return null;
  }


  /**
   * Comprueba si el usuario tiene permiso para una acción específica, comparando el permiso frente a la lista de permisos obtenida desde los roles del cliente
   * @param permission Permiso  (nivel del menú) que se desea verificar frente al arbol de permisos del usuario
   * @returns true si el usuario tiene permiso, false en caso contrario
   */
  public hasPermission(permission: string): boolean {
    //Validación específica del permiso
    if (this.permissionsTree[permission])
      return true;

    const parts = permission.split('.');
    for (let i = parts.length; i > 0; i--) {
      const wildCardPermission = parts.slice(0, i).join('.');
      if (this.permissionsTree[wildCardPermission + '.*']) {
        return true;
      }
    }
    return false;
  }

  /**
   * obtiene las opciones de permiso (acciones) para una acción específica, comparando el permiso frente a la lista de permisos obtenida desde los roles del cliente
   * @param permission Permiso (nivel del menú) que se desea verificar frente al arbol de permisos del usuario
   * @returns opciones de permiso (acciones) para el permiso especificado
   */
  public getActions(permission: string): any {
    //Verificar permiso específico
    if (this.permissionsTree[permission])
      return this.permissionsTree[permission];

    const parts = permission.split('.');
    for (let i = parts.length; i > 0; i--) {
      const wildCardPermission = parts.slice(0, i).join('.') + '.*';
      if (this.permissionsTree[wildCardPermission]) {
        return this.permissionsTree[wildCardPermission];
      }
    }
    return this.defaultOptions;
  }
}
