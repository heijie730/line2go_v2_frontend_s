import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserProfileComponent} from "./user-profile.component";
import {AuthGuardService} from "../../_helpers/authGuard.service";
import {BindEmailComponent} from "./bind-email/bind-email.component";

const routes: Routes = [
  {path: '', component: UserProfileComponent, canActivate: [AuthGuardService]},
  {path: 'bind-email', component: BindEmailComponent, canActivate: [AuthGuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
