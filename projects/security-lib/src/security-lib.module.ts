import { NgModule } from '@angular/core';
import { JwtService } from 'security-lib';


@NgModule({
  providers: [JwtService]
})
export class SecurityLibModule { }
