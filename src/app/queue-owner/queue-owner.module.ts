import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QueueOwnerRoutingModule} from "./queue-owner-routing.module";
import {ManageQueueComponent} from "./manage-queue/manage-queue.component";
import {LeaderHomeComponent} from "./leader-home/leader-home.component";
import {BuildSurveyComponent} from "./manage-queue/setting/survey/build-survey/build-survey.component";
import {AddQuestionComponent} from "./manage-queue/setting/survey/build-survey/add-question/add-question.component";
import {PreviewSurveyComponent} from "./manage-queue/setting/survey/preview-survey/preview-survey.component";
import {SurveyListComponent} from "./manage-queue/setting/survey/survey-list/survey-list.component";

import {LeaderScanComponent} from "./manage-queue/leader-scan/leader-scan.component";
import {TagListComponent} from "./manage-queue/setting/tag-list/tag-list.component";
import {CreateTagComponent} from "./manage-queue/setting/tag-list/create-tag/create-tag.component";
import {EditTagComponent} from "./manage-queue/setting/tag-list/edit-tag/edit-tag.component";
import {ManualInformComponent} from "./manage-queue/setting/action-management/manual-inform/manual-inform.component";
import {ActionManagementComponent} from "./manage-queue/setting/action-management/action-management.component";
import {TicketWithTagsComponent} from "./manage-queue/setting/action-management/ticket-with-tags/ticket-with-tags.component";
import {TagRulesComponent} from "./manage-queue/setting/tag-rules/tag-rules.component";
import {
  StatusQuestionsComponent
} from "./manage-queue/setting/action-management/status-questions/status-questions.component";
import {
  ConflictTagGroupComponent
} from "./manage-queue/setting/tag-rules/conflict-tag-group/conflict-tag-group.component";
import {
  SaveConflictTagGroupComponent
} from "./manage-queue/setting/tag-rules/conflict-tag-group/save-conflict-tag-group/save-conflict-tag-group.component";
import {TicketListComponent} from "./manage-queue/send/ticket-list/ticket-list.component";
import {TicketDetailModalComponent} from "./manage-queue/send/ticket-detail-modal/ticket-detail-modal.component";
import {ScanResultComponent} from "./scan-result/scan-result.component";

// import {QueueNotificationComponent} from "./manage-queue/setting/queue-notification/queue-notification.component";
// import {SmsComponent} from "./manage-queue/setting/queue-notification/sms/sms.component";
// import {VmsComponent} from "./manage-queue/setting/queue-notification/vms/vms.component";
// import {
//   SmsSendRecordComponent
// } from "./manage-queue/setting/queue-notification/sms/sms-send-record/sms-send-record.component";
// import {
//   VmsSendRecordComponent
// } from "./manage-queue/setting/queue-notification/vms/vms-send-record/vms-send-record.component";
// import {
//   SmsSendRecordDetailComponent
// } from "./manage-queue/setting/queue-notification/sms/sms-send-record/sms-send-record-detail/sms-send-record-detail.component";
// import {
//   VmsSendRecordDetailComponent
// } from "./manage-queue/setting/queue-notification/vms/vms-send-record/vms-send-record-detail/vms-send-record-detail.component";
import {ShareModule} from "../share/share.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {QRCodeModule} from "angularx-qrcode";
import {
  FillSurveyModalComponent
} from "./manage-queue/send/ticket-detail-modal/fill-survey-modal/fill-survey-modal.component";
import {
  MemberLoginOptionsComponent
} from "./manage-queue/setting/member-options/member-login-options/member-login-options.component";
import {TicketMsgComponent} from './manage-queue/setting/action-management/ticket-msg/ticket-msg.component';
import {QuillEditorComponent, QuillViewComponent} from "ngx-quill";
import {MemberOptionsComponent} from './manage-queue/setting/member-options/member-options.component';
import {
  MemberTicketSettingComponent
} from './manage-queue/setting/member-options/member-ticket-setting/member-ticket-setting.component';
import {ServiceTimeManagerComponent} from './manage-queue/setting/service-time-manager/service-time-manager.component';
import {AutoTriggerComponent} from "./manage-queue/setting/service-time-manager/auto-trigger/auto-trigger.component";
import {
  SaveManualTriggerComponent
} from './manage-queue/setting/service-time-manager/manual-trigger/save-manual-trigger/save-manual-trigger.component';
import {
  ManualTriggerComponent
} from "./manage-queue/setting/service-time-manager/manual-trigger/manual-trigger.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DashboardManagerComponent} from "./manage-queue/setting/dashboard-manager/dashboard-manager.component";
import {
  SaveDashboardTemplateComponent
} from './manage-queue/setting/dashboard-manager/dashboard-template-list/save-dashboard-template/save-dashboard-template.component';
import {
  SaveDashboardItemComponent
} from './manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/save-dashboard-item.component';
import {
  DashboardItemListComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/dashboard-item-list.component";
import {
  DashboardTemplateListComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-template-list/dashboard-template-list.component";
import { DashboardTemplateComponent } from './manage-queue/setting/dashboard-manager/dashboard-template-list/save-dashboard-template/dashboard-template/dashboard-template.component';
import { DashboardComponent } from './manage-queue/setting/dashboard-manager/dashboard/dashboard.component';
import { UserImageItemComponent } from './manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/user-image-item/user-image-item.component';
import {
  CustomContentItemComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/custom-content-item/custom-content-item.component";
import { SaveCustomContentItemComponent } from './manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/custom-content-item/save-custom-content-item/save-custom-content-item.component';
import {
  TicketTakenListItemComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/ticket-taken-list-item/ticket-taken-list-item.component";
import {
  SaveTicketTakenListItemComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/ticket-taken-list-item/save-ticket-taken-list-item/save-ticket-taken-list-item.component";
import { SaveUserImageItemComponent } from './manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/user-image-item/save-user-image-item/save-user-image-item.component';
import { VoiceBoardCastComponent } from './manage-queue/setting/common/voice-board-cast/voice-board-cast.component';
import { BaseSaveItemComponent } from './manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/base-save-item/base-save-item.component';
import {
  BaseDraggable
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/base-draggable/base-draggable.component";
import { BoardCastManagerComponent } from './manage-queue/setting/board-cast-manager/board-cast-manager.component';
import {
  SaveBoardCastItemComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/board-cast-item/save-board-cast-item/save-board-cast-item.component";
import {
  BoardCastItemComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/board-cast-item/board-cast-item.component";
import {
  SaveManualInformComponent
} from "./manage-queue/setting/action-management/manual-inform/save-manual-inform/save-manual-inform.component";
import {
  SaveTicketTakenRuleItemComponent
} from "./manage-queue/setting/action-management/ticket-taken-rule/save-ticket-taken-rule-item/save-ticket-taken-rule-item.component";
import {
  TicketTakenRuleComponent
} from "./manage-queue/setting/action-management/ticket-taken-rule/ticket-taken-rule.component";
import { TicketDateSelectComponent } from './manage-queue/setting/action-management/ticket-taken-rule/save-ticket-taken-rule-item/ticket-date-select/ticket-date-select.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { ChildQueueManagerComponent } from './manage-queue/setting/child-queue-manager/child-queue-manager.component';
import { ChildQueueListComponent } from './manage-queue/setting/child-queue-manager/child-queue-list/child-queue-list.component';
import {
  SaveChildQueueComponent
} from "./manage-queue/setting/child-queue-manager/child-queue-list/save-child-queue/save-child-queue.component";
import { ScanChildQueueComponent } from './manage-queue/setting/child-queue-manager/child-queue-list/scan-child-queue/scan-child-queue.component';
import { ChildQueueQrcodeComponent } from './manage-queue/setting/child-queue-manager/child-queue-list/child-queue-qrcode/child-queue-qrcode.component';
import { ChildQueueScanResultComponent } from './manage-queue/setting/child-queue-manager/child-queue-list/scan-child-queue/child-queue-scan-result/child-queue-scan-result.component';
import {EditBaseInfoComponent} from "./manage-queue/setting/edit-base-info/edit-base-info.component";
import { NotificationTemplateComponent } from './manage-queue/setting/common/notification-template/notification-template.component';
import { NotificationTemplateSwitchComponent } from './manage-queue/setting/common/notification-template-switch/notification-template-switch.component';
import { CustomNotificationTemplateComponent } from './manage-queue/setting/common/custom-notification-template/custom-notification-template.component';
import { EditQueueDescComponent } from './manage-queue/setting/edit-base-info/edit-queue-desc/edit-queue-desc.component';
import { EditReminderTextComponent } from './manage-queue/setting/edit-base-info/edit-reminder-text/edit-reminder-text.component';
import { EditNickNameComponent } from './manage-queue/setting/edit-base-info/edit-nick-name/edit-nick-name.component';
import { DiscoveryManagerComponent } from './manage-queue/setting/edit-base-info/discovery-manager/discovery-manager.component';
import { ExportExcelComponent } from './manage-queue/send/ticket-list/export-excel/export-excel.component';
import { TransferQueueComponent } from './manage-queue/setting/edit-base-info/transfer-queue/transfer-queue.component';
import { ScanTransferQueueComponent } from './manage-queue/setting/edit-base-info/transfer-queue/scan-transfer-queue/scan-transfer-queue.component';
import { TransferQueueScanResultComponent } from './manage-queue/setting/edit-base-info/transfer-queue/scan-transfer-queue/transfer-queue-scan-result/transfer-queue-scan-result.component';
import {SurveyStatsComponent} from "./manage-queue/setting/survey/survey-stats/survey-stats.component";
import { EditQueueNameComponent } from './manage-queue/setting/edit-base-info/edit-queue-name/edit-queue-name.component';


@NgModule({
  declarations: [
    LeaderHomeComponent,
    ManageQueueComponent,
    EditBaseInfoComponent,
    // EditReminderTextComponent,
    BuildSurveyComponent,
    AddQuestionComponent,
    PreviewSurveyComponent,
    SurveyListComponent,
    LeaderScanComponent, TagListComponent,
    CreateTagComponent,
    EditTagComponent,
    ManualInformComponent,
    SaveManualInformComponent,
    ActionManagementComponent,
    TicketWithTagsComponent,
    TagRulesComponent,
    StatusQuestionsComponent,
    ConflictTagGroupComponent,
    SaveConflictTagGroupComponent,
    TicketListComponent,
    TicketDetailModalComponent,
    ScanResultComponent,

    //
    // QueueNotificationComponent,
    // SmsComponent,
    // VmsComponent,


    TicketTakenRuleComponent,
    SaveTicketTakenRuleItemComponent,
    // SmsSendRecordComponent,
    // VmsSendRecordComponent,
    // SmsSendRecordDetailComponent,
    // VmsSendRecordDetailComponent,
    FillSurveyModalComponent,
    MemberLoginOptionsComponent,
    TicketMsgComponent,
    MemberOptionsComponent,
    MemberTicketSettingComponent,
    ServiceTimeManagerComponent,
    AutoTriggerComponent,
    ManualTriggerComponent,
    // SaveAutoTriggerComponent,
    SaveManualTriggerComponent,
    DashboardManagerComponent,
    SaveDashboardTemplateComponent,
    DashboardItemListComponent,
    SaveDashboardItemComponent,
    DashboardTemplateListComponent,
    CustomContentItemComponent,
    DashboardTemplateComponent,
    DashboardComponent,
    TicketTakenListItemComponent,
    UserImageItemComponent,
    SaveCustomContentItemComponent,
    SaveTicketTakenListItemComponent,
    SaveUserImageItemComponent,
    BaseDraggable,
    BoardCastItemComponent,
    SaveBoardCastItemComponent,
    VoiceBoardCastComponent,
    BaseSaveItemComponent,
    BoardCastManagerComponent,
    TicketDateSelectComponent,
    ChildQueueManagerComponent,
    ChildQueueListComponent,
    SaveChildQueueComponent,
    ScanChildQueueComponent,
    ChildQueueQrcodeComponent,
    ChildQueueScanResultComponent,
    NotificationTemplateComponent,
    NotificationTemplateSwitchComponent,
    CustomNotificationTemplateComponent,
    EditQueueDescComponent,
    EditReminderTextComponent,
    EditNickNameComponent,
    DiscoveryManagerComponent,
    ExportExcelComponent,
    TransferQueueComponent,
    ScanTransferQueueComponent,
    TransferQueueScanResultComponent,
    SurveyStatsComponent,
    EditQueueNameComponent,

  ],
  imports: [
    CommonModule,
    QueueOwnerRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    QRCodeModule,
    QuillEditorComponent,
    DragDropModule,
    QuillViewComponent,
    NgbModule,
  ],
  exports: []
})
export class QueueOwnerModule {
}
