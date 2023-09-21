import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SelectRoleComponent} from "./select-role.component";
import {AuthGuardService} from "../../_helpers/authGuard.service";

const routes: Routes = [
  {path: '', component: SelectRoleComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectRoleRoutingModule { }
