import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ServiceRequestComponent} from "./service-request.component";
import {AuthGuardService} from "../../_helpers/authGuard.service";
import {ServiceRequestDetailComponent} from "./service-request-detail/service-request-detail.component";
import {AddServiceRequestComponent} from "./add-service-request/add-service-request.component";

const routes: Routes = [
  {path: '', component: ServiceRequestComponent, canActivate: [AuthGuardService]},
  {path: 'detail/:id', component: ServiceRequestDetailComponent, canActivate: [AuthGuardService]},
  {path: 'add', component: AddServiceRequestComponent, canActivate: [AuthGuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRequestRoutingModule { }
