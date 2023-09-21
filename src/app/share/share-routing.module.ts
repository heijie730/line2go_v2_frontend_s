import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotificationComponent} from "./notification/list/notification.component";
import {AuthGuardService} from "../_helpers/authGuard.service";
import {DetailComponent} from "./notification/detail/detail.component";
import {ErrorPageComponent} from "./error-page/error-page.component";

const routes: Routes = [
  {path: 'notifications', component: NotificationComponent, canActivate: [AuthGuardService]},
  {path: 'notifications/:id/:checked', component: DetailComponent, canActivate: [AuthGuardService]},
  {path: 'error', component: ErrorPageComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareRoutingModule {
}
