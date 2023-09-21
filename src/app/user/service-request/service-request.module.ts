import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ServiceRequestComponent} from "./service-request.component";
import {ServiceRequestDetailComponent} from "./service-request-detail/service-request-detail.component";
import {AddServiceRequestComponent} from "./add-service-request/add-service-request.component";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ServiceRequestRoutingModule} from "./service-request-routing.module";



@NgModule({
  declarations: [
    ServiceRequestComponent,
    ServiceRequestDetailComponent,
    AddServiceRequestComponent,],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ServiceRequestRoutingModule
  ]
})
export class ServiceRequestModule { }
