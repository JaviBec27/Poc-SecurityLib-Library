import { Injectable } from '@angular/core';

interface DecodedToken {
  permissions: { p: string, o: string }[];
  exp: number;
  iat?: number;
}

export interface tokenInfo {
  expiration: Date,
  permissionsTree: { [key: string]: permissionOptions }
}

export interface permissionOptions {
  denyAccess: boolean,
  allowCreate: boolean,
  allowRead: boolean,
  allowUpdate: boolean,
  allowDelete: boolean
  allowExport: boolean,
  allowPrint: boolean
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  public decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as DecodedToken;
    } catch (Error) {
      console.error('Invalid token:', Error);
      return null;
    }
  }

  public formatTokenData(token: string): tokenInfo | null {

    const permissionsTree: { [key: string]: permissionOptions } = {};
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }

    //Formatea de {p:"1.2.3", o:"0111111" } a {"1.2.3":{denyAccess:true,allowCreate:true... etc }}
    decoded.permissions.forEach(permission => {
      permissionsTree[permission.p] = this.setPermissionOptions(this.convertFlags(permission.o))
    });

    return {
      permissionsTree,
      expiration: new Date(decoded.exp * 1000)
    };
  }

  private convertFlags(flags: string): boolean[] {
    return flags.split('').map(flag => flag === '1');
  }

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

