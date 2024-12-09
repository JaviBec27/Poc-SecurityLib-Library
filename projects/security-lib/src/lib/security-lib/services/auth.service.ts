import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { permissionOptions } from '../models/tokenModels';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private permissionsTree: { [key: string]: permissionOptions } | null;

  private authStorageKey: string = "permissionsTree";

  private defaultOptions: permissionOptions = {
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
  savePermissionsTree(permissionsTree: { [key: string]: permissionOptions }) {
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
    //Si no tiene árbol de permisos, no tiene permiso a nada.
    if (!this.permissionsTree)
      return false;

    let hasWilcardPermission = false;
    //Dividimos el permiso en partes para recorrerlo en busca de wildcard con permisos revocados
    const parts = permission.split('.');
    for (let i = parts.length; i > 0; i--) {

      const wildCardPermission = parts.slice(0, i).join('.');
      // Verificar si hay una revocación en un permiso con wildcards
      if (this.permissionsTree[wildCardPermission + '.*']) {
        hasWilcardPermission = true;
        if (this.permissionsTree[wildCardPermission + '.*'].denyAccess) {
          return false;//si encontró un wildcard con permiso revocado, se devuelve porque cualquier denyAccess tiene prioridad
        }
      }

      //Verificamos si tiene el permiso explicito
      if (this.permissionsTree[permission]) {
        // Primero verificamos si hay un permiso explícito de revocación (sobre la ruta exacta)
        return !this.permissionsTree[permission].denyAccess;
      }

      // Verificar permisos normales con comodines
      if (hasWilcardPermission) {
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
  public getActions(permission: string): permissionOptions {
    if (!this.permissionsTree)
      return this.defaultOptions;

    let allOptions: permissionOptions[] = [];
    //Dividimos el permiso en partes para recorrerlo en busca de wildcard con permisos revocados
    const parts = permission.split('.');
    for (let i = parts.length; i > 0; i--) {

      const wildCardPermission = parts.slice(0, i).join('.');
      // Verificar si hay una revocación en un permiso con wildcards
      if (this.permissionsTree[wildCardPermission + '.*']) {
        if (this.permissionsTree[wildCardPermission + '.*'].denyAccess) {
          return this.defaultOptions;//si encontró un wildcard con permiso revocado, se devuelve porque cualquier denyAccess tiene prioridad
        }
        allOptions.push(this.permissionsTree[wildCardPermission + '.*']);
      }
    }

    //Verificamos si tiene el permiso explicito
    if (this.permissionsTree[permission]) {
      // Primero verificamos si hay un permiso explícito de revocación (sobre la ruta exacta)
      if (this.permissionsTree[permission].denyAccess) {
        return this.defaultOptions;
      }

      allOptions.push(this.permissionsTree[permission]);


    }

    //únicamente combina  las opciones de permisos cuando tiene mas de un objeto
    if (allOptions.length > 1)
      return this.JoinPermissionOptions(allOptions);
    else
      return allOptions[0];
  }


  /**
   * dada una lista de opciones de permisos para un permiso específico, se combinan todas las opciones en una sola
   * @param allOptions lista de opciones de permisos para un permiso específico
   * @returns
   */
  private JoinPermissionOptions(allOptions: permissionOptions[]): permissionOptions {
    if (allOptions.length === 0) {
      return this.defaultOptions;
    }

    let combinedOptions: permissionOptions = {
      denyAccess: false,
      allowCreate: false,
      allowRead: false,
      allowUpdate: false,
      allowDelete: false,
      allowExport: false,
      allowPrint: false

    };

    allOptions.forEach(action => {
      combinedOptions = {
        denyAccess: combinedOptions.denyAccess || action.denyAccess,
        allowCreate: combinedOptions.allowCreate || action.allowCreate,
        allowRead: combinedOptions.allowRead || action.allowRead,
        allowUpdate: combinedOptions.allowUpdate || action.allowUpdate,
        allowDelete: combinedOptions.allowDelete || action.allowDelete,
        allowExport: combinedOptions.allowExport || action.allowExport,
        allowPrint: combinedOptions.allowPrint || action.allowPrint
      }
    });

    return combinedOptions;
  }



}
