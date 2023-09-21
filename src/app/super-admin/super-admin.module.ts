import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { ServiceRequestDetailComponent } from './service-request/service-request-detail/service-request-detail.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SuperAdminRoutingModule} from "./super-admin-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { QueueInitTemplateComponent } from './dashboard/queue-init-template/queue-init-template.component';
import { QueueInitItemComponent } from './dashboard/queue-init-item/queue-init-item.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { VariableComponent } from './variable/variable.component';
import { VariableDetailComponent } from './variable/variable-detail/variable-detail.component';



@NgModule({
  declarations: [
    ServiceRequestComponent,
    ServiceRequestDetailComponent,
    DashboardComponent,
    QueueInitTemplateComponent,
    QueueInitItemComponent,
    UsersComponent,
    UserDetailComponent,
    VariableComponent,
    VariableDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SuperAdminRoutingModule
  ]
})
export class SuperAdminModule { }
