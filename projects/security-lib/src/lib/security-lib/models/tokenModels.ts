export interface decodedToken {
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
