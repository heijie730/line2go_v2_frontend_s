import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailComponent} from "./notification/detail/detail.component";
import {NotificationComponent} from "./notification/list/notification.component";
import {IconComponent} from "./notification/icon/icon.component";
import {ShareRoutingModule} from "./share-routing.module";
import {FormsModule} from "@angular/forms";
import {CustomCurrencyPipe} from "./CustomCurrencyPipe";
import {ToolTipComponent} from "./tool-tip/tool-tip.component";
import {HeaderComponent} from "./header/header.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {CalendarComponent} from "./calendar/calendar.component";
import {QRCodeModule} from "angularx-qrcode";
import {TooltipDirective} from "../_helpers/TooltipDirective";
import {TimeRangeComponent} from './time-range/time-range.component';
import {CalendarSelectComponent} from './calendar/calendar-select/calendar-select.component';
import {UserUploadComponent} from "./user-upload/user-upload.component";
import {TicketV2Component} from './ticket/ticket-v2/ticket-v2.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {AccordionComponent} from './accordion/accordion.component';
import {FillSurveyContentComponent} from './fill-survey-content/fill-survey-content.component';
import {BoardCastComponent} from "./board-cast/board-cast.component";
import {SelectTagComponent} from './select-tag/select-tag.component';
import { DateSelectComponent } from './date-select/date-select.component';
import {MultipleDateComponent} from "./date-select/multiple-date/multiple-date.component";
import {RangeDateComponent} from "./date-select/range-date/range-date.component";
import { SingleDateComponent } from './date-select/single-date/single-date.component';
import { ClipboardComponent } from './clipboard/clipboard.component';
import {NotifySwitchComponent} from "./notify-switch/notify-switch.component";
import { HeaderV2Component } from './header/header-v2/header-v2.component';
import { GeolocationComponent } from './geolocation/geolocation.component';


@NgModule({
  declarations: [
    NotificationComponent,
    DetailComponent,
    IconComponent,
    CustomCurrencyPipe,
    ToolTipComponent,
    HeaderComponent,
    CalendarComponent,
    BoardCastComponent,
    TooltipDirective,
    TimeRangeComponent,
    CalendarSelectComponent,
    UserUploadComponent,
    TicketV2Component,
    ErrorPageComponent,
    AccordionComponent,
    FillSurveyContentComponent,
    SelectTagComponent,
    RangeDateComponent,
    DateSelectComponent,
    MultipleDateComponent,
    SingleDateComponent,
    HeaderV2Component,
    ClipboardComponent,
    NotifySwitchComponent,
    GeolocationComponent
  ],
  imports: [
    ShareRoutingModule,
    CommonModule,
    FormsModule,
    ScrollingModule,
    QRCodeModule
  ], exports: [
        IconComponent,
        CustomCurrencyPipe,
        HeaderComponent,
        HeaderV2Component,
        ToolTipComponent,
        CalendarComponent,
        BoardCastComponent,
        TimeRangeComponent,
        CalendarSelectComponent,
        UserUploadComponent,
        TicketV2Component,
        AccordionComponent,
        FillSurveyContentComponent,
        SelectTagComponent,
        RangeDateComponent,
        DateSelectComponent,
        MultipleDateComponent,
        ClipboardComponent,
        GeolocationComponent
    ]
})
export class ShareModule {
}
