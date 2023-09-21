import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QueueUpComponent} from "./queue-up/queue-up.component";
import {AuthGuardService} from "../_helpers/authGuard.service";
import {FillSurveyComponent} from "./queue-up/fill-survey/fill-survey.component";
import {QueueInfoComponent} from "./queue-info/queue-info.component";
import {MemberHomeComponent} from "./member-home/member-home.component";
// import {TicketDetailComponent} from "./member-home/ticket-detail/ticket-detail.component";
import {MemberScanComponent} from "./member-scan/member-scan.component";
import {ScanResultComponent} from "../queue-owner/scan-result/scan-result.component";
import {CheckQueueUpResultComponent} from "./queue-up/check-queue-up-result/check-queue-up-result.component";
import {TicketDownloadComponent} from "./ticket-by-card/ticket-download/ticket-download.component";
import {SearchQueuesComponent} from "./search-queues/search-queues.component";
import {NearbyQueuesComponent} from "./nearby-queues/nearby-queues.component";

const routes: Routes = [
  {path: 'queue-up/:queueId', component: QueueUpComponent, canActivate: [AuthGuardService]},
  {path: 'queue-up/:queueId/:date', component: QueueUpComponent, canActivate: [AuthGuardService]},
  {path: 'check-queue-up-result', component: CheckQueueUpResultComponent, canActivate: [AuthGuardService]},
  {path: 'fill-survey/:queueId/:surveyId/:type', component: FillSurveyComponent, canActivate: [AuthGuardService]},
  {path: 'queue-info/:queueId/:date', component: QueueInfoComponent, canActivate: [AuthGuardService]},
  {path: 'home', component: MemberHomeComponent, canActivate: [AuthGuardService]},
  // {path: 'home/ticket-detail/:id', component: TicketDetailComponent, canActivate: [AuthGuardService]},
  {path: 'scan', component: MemberScanComponent, canActivate: [AuthGuardService]},
  {path: 'scan-result/:ticketId', component: ScanResultComponent, canActivate: [AuthGuardService]},
  {path: 'ticket-download/:queueId/:ticketId', component: TicketDownloadComponent, canActivate: [AuthGuardService]},
  {path: 'search-queues', component: SearchQueuesComponent, canActivate: [AuthGuardService]},
  {path: 'nearby-queues', component: NearbyQueuesComponent, canActivate: [AuthGuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
