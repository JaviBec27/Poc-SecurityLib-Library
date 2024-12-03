import { NgModule } from '@angular/core';
import { AuthService, CryptService, JwtDecodeService, StorageService } from './public-api';



@NgModule({
  providers: [JwtDecodeService, AuthService, StorageService, CryptService]
})
export class SecurityLibModule { }
