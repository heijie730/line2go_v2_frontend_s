import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QueueUpComponent} from "./queue-up/queue-up.component";
import {QueueInfoComponent} from "./queue-info/queue-info.component";
import {FillSurveyComponent} from "./queue-up/fill-survey/fill-survey.component";
import {MemberHomeComponent} from "./member-home/member-home.component";
import {MemberScanComponent} from "./member-scan/member-scan.component";
import {TicketByCardComponent} from "./ticket-by-card/ticket-by-card.component";
import {RouterModule} from "@angular/router";
import {ShareModule} from "../share/share.module";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {FormsModule} from "@angular/forms";
import {MemberRoutingModule} from "./member-routing.module";
import {CheckQueueUpResultComponent} from "./queue-up/check-queue-up-result/check-queue-up-result.component";
import { TicketDownloadComponent } from './ticket-by-card/ticket-download/ticket-download.component';
import {QuillViewComponent} from "ngx-quill";
import { SearchQueuesComponent } from './search-queues/search-queues.component';
import { NearbyQueuesComponent } from './nearby-queues/nearby-queues.component';



@NgModule({
  declarations: [
    QueueUpComponent,
    QueueInfoComponent,
    FillSurveyComponent,
    MemberHomeComponent,
    MemberScanComponent,
    TicketByCardComponent,
    CheckQueueUpResultComponent,
    TicketDownloadComponent,
    SearchQueuesComponent,
    NearbyQueuesComponent,
  ],
    imports: [
        CommonModule,
        RouterModule,
        MemberRoutingModule,
        ZXingScannerModule,
        FormsModule,
        ShareModule,
        QuillViewComponent
    ]
})
export class MemberModule { }
