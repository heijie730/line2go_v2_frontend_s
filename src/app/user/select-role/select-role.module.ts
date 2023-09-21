import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectRoleComponent} from "./select-role.component";
import {ShareModule} from "../../share/share.module";
import {RouterModule} from "@angular/router";
import {SelectRoleRoutingModule} from "./select-role-routing.module";



@NgModule({
  declarations: [SelectRoleComponent,
  ],
  imports: [
    CommonModule,
    SelectRoleRoutingModule,
    RouterModule,
    ShareModule
  ]
})
export class SelectRoleModule { }
