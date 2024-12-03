import { Injectable } from '@angular/core';
import { decodedToken, permissionOptions, tokenInfo  } from '../models/tokenModels';


@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  constructor() { }

  /**
   *
   * @param token jwt
   * @returns un jwt decodificado desde su payload
   */
  public decodeToken(token: string): decodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as decodedToken;
    } catch (Error) {
      console.error('Invalid token:', Error);
      return null;
    }
  }

  /**
   *Formatea los datos del token para facilitar su uso, sobre todo lo relacioado con los permisos
   * @param token
   * @returns
   */
  public formatTokenData(token: string): tokenInfo | null {

    const permissionsTree: { [key: string]: permissionOptions } = {};
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }


    /**
     * Formatea de {p:"1.2.3", o:"0111111" } a {"1.2.3":{denyAccess:true,allowCreate:true... etc }}
     */
    decoded.permissions.forEach(permission => {
      permissionsTree[permission.p] = this.setPermissionOptions(this.convertFlags(permission.o))
    });

    return {
      permissionsTree,
      expiration: new Date(decoded.exp * 1000)
    };
  }

  /**
   * Convierte los flags de permisos en un array de booleanos
   * @param flags banderas de opciones permisos (acciones) en formato string "1000001"
   * @returns una lista de booleanos con las opciones de permisos
   */
  private convertFlags(flags: string): boolean[] {
    return flags.split('').map(flag => flag === '1');
  }

  /**
   * Formatea el arreglo de booleanos en un objeto con nombres específicos para cada bandera
   * @param flags arreglo de booleanos con las opciones de permisos
   * @returns un objeto con las opciones de permisos con nombres específicos
   */
  private setPermissionOptions(flags: boolean[]): permissionOptions {
    return {
      denyAccess: flags[0],
      allowCreate: flags[1],
      allowRead: flags[2],
      allowUpdate: flags[3],
      allowDelete: flags[4],
      allowExport: flags[5],
      allowPrint: flags[6]
    }
  }
}

