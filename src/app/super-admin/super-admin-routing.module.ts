import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SuperAdminComponent} from "./super-admin.component";
import {AuthGuardService} from "../_helpers/authGuard.service";
import {ServiceRequestComponent} from "./service-request/service-request.component";
import {ServiceRequestDetailComponent} from "./service-request/service-request-detail/service-request-detail.component";
import {SuperAdminGuard} from "../_helpers/super-admin.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {QueueInitTemplateComponent} from "./dashboard/queue-init-template/queue-init-template.component";
import {QueueInitItemComponent} from "./dashboard/queue-init-item/queue-init-item.component";
import {UsersComponent} from "./users/users.component";
import {UserDetailComponent} from "./users/user-detail/user-detail.component";
import {VariableComponent} from "./variable/variable.component";
import {VariableDetailComponent} from "./variable/variable-detail/variable-detail.component";

const routes: Routes = [
  {path: '', component: SuperAdminComponent, canActivate: [SuperAdminGuard]},
  {path: 'service-request', component: ServiceRequestComponent, canActivate: [SuperAdminGuard]},
  {path: 'service-request/:id', component: ServiceRequestDetailComponent, canActivate: [SuperAdminGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [SuperAdminGuard]},
  {path: 'dashboard/queue-init-template', component: QueueInitTemplateComponent, canActivate: [SuperAdminGuard]},
  {path: 'dashboard/queue-init-item', component: QueueInitItemComponent, canActivate: [SuperAdminGuard]},
  {path: 'users', component: UsersComponent, canActivate: [SuperAdminGuard]},
  {path: 'users/:id', component: UserDetailComponent, canActivate: [SuperAdminGuard]},
  {path: 'variable', component: VariableComponent, canActivate: [SuperAdminGuard]},
  {path: 'variable/:type', component: VariableDetailComponent, canActivate: [SuperAdminGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
