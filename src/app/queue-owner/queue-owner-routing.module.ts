import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageQueueComponent} from "./manage-queue/manage-queue.component";
import {AuthGuardService} from "../_helpers/authGuard.service";
import {LeaderHomeComponent} from "./leader-home/leader-home.component";
import {LeaderScanComponent} from "./manage-queue/leader-scan/leader-scan.component";

import {SurveyListComponent} from "./manage-queue/setting/survey/survey-list/survey-list.component";
import {BuildSurveyComponent} from "./manage-queue/setting/survey/build-survey/build-survey.component";
import {PreviewSurveyComponent} from "./manage-queue/setting/survey/preview-survey/preview-survey.component";
import {AddQuestionComponent} from "./manage-queue/setting/survey/build-survey/add-question/add-question.component";
import {TagListComponent} from "./manage-queue/setting/tag-list/tag-list.component";
import {TagRulesComponent} from "./manage-queue/setting/tag-rules/tag-rules.component";
import {
  ConflictTagGroupComponent
} from "./manage-queue/setting/tag-rules/conflict-tag-group/conflict-tag-group.component";
import {
  SaveConflictTagGroupComponent
} from "./manage-queue/setting/tag-rules/conflict-tag-group/save-conflict-tag-group/save-conflict-tag-group.component";
import {CreateTagComponent} from "./manage-queue/setting/tag-list/create-tag/create-tag.component";
import {EditTagComponent} from "./manage-queue/setting/tag-list/edit-tag/edit-tag.component";
import {ManualInformComponent} from "./manage-queue/setting/action-management/manual-inform/manual-inform.component";

import {ActionManagementComponent} from "./manage-queue/setting/action-management/action-management.component";
import {TicketWithTagsComponent} from "./manage-queue/setting/action-management/ticket-with-tags/ticket-with-tags.component";
import {
  StatusQuestionsComponent
} from "./manage-queue/setting/action-management/status-questions/status-questions.component";
import {TicketListComponent} from "./manage-queue/send/ticket-list/ticket-list.component";
// import {QueueNotificationComponent} from "./manage-queue/setting/queue-notification/queue-notification.component";
// import {SmsComponent} from "./manage-queue/setting/queue-notification/sms/sms.component";
// import {
//   SmsSendRecordComponent
// } from "./manage-queue/setting/queue-notification/sms/sms-send-record/sms-send-record.component";
// import {
//   SmsSendRecordDetailComponent
// } from "./manage-queue/setting/queue-notification/sms/sms-send-record/sms-send-record-detail/sms-send-record-detail.component";
// import {VmsComponent} from "./manage-queue/setting/queue-notification/vms/vms.component";
// import {
//   VmsSendRecordComponent
// } from "./manage-queue/setting/queue-notification/vms/vms-send-record/vms-send-record.component";
// import {
//   VmsSendRecordDetailComponent
// } from "./manage-queue/setting/queue-notification/vms/vms-send-record/vms-send-record-detail/vms-send-record-detail.component";
import {MemberLoginOptionsComponent} from "./manage-queue/setting/member-options/member-login-options/member-login-options.component";
import {MemberOptionsComponent} from "./manage-queue/setting/member-options/member-options.component";
import {
  MemberTicketSettingComponent
} from "./manage-queue/setting/member-options/member-ticket-setting/member-ticket-setting.component";
import {ServiceTimeManager} from "../models/QueueVo";
import {AutoTriggerComponent} from "./manage-queue/setting/service-time-manager/auto-trigger/auto-trigger.component";
import {
  ManualTriggerComponent
} from "./manage-queue/setting/service-time-manager/manual-trigger/manual-trigger.component";
import {
  SaveManualTriggerComponent
} from "./manage-queue/setting/service-time-manager/manual-trigger/save-manual-trigger/save-manual-trigger.component";
import {ServiceTimeManagerComponent} from "./manage-queue/setting/service-time-manager/service-time-manager.component";
import {DashboardManagerComponent} from "./manage-queue/setting/dashboard-manager/dashboard-manager.component";

import {
  SaveDashboardTemplateComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-template-list/save-dashboard-template/save-dashboard-template.component";
import {
  SaveDashboardItemComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/save-dashboard-item/save-dashboard-item.component";
import {
  DashboardItemListComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-item-list/dashboard-item-list.component";
import {
  DashboardTemplateListComponent
} from "./manage-queue/setting/dashboard-manager/dashboard-template-list/dashboard-template-list.component";
import {DashboardComponent} from "./manage-queue/setting/dashboard-manager/dashboard/dashboard.component";
import {BoardCastManagerComponent} from "./manage-queue/setting/board-cast-manager/board-cast-manager.component";
import {
  SaveManualInformComponent
} from "./manage-queue/setting/action-management/manual-inform/save-manual-inform/save-manual-inform.component";
import {
  SaveTicketTakenRuleItemComponent
} from "./manage-queue/setting/action-management/ticket-taken-rule/save-ticket-taken-rule-item/save-ticket-taken-rule-item.component";
import {
  TicketTakenRuleComponent
} from "./manage-queue/setting/action-management/ticket-taken-rule/ticket-taken-rule.component";
import {ChildQueueManagerComponent} from "./manage-queue/setting/child-queue-manager/child-queue-manager.component";
import {
  ChildQueueListComponent
} from "./manage-queue/setting/child-queue-manager/child-queue-list/child-queue-list.component";
import {
  SaveChildQueueComponent
} from "./manage-queue/setting/child-queue-manager/child-queue-list/save-child-queue/save-child-queue.component";
import {
  ScanChildQueueComponent
} from "./manage-queue/setting/child-queue-manager/child-queue-list/scan-child-queue/scan-child-queue.component";
import {
  ChildQueueScanResultComponent
} from "./manage-queue/setting/child-queue-manager/child-queue-list/scan-child-queue/child-queue-scan-result/child-queue-scan-result.component";
import {
  ChildQueueQrcodeComponent
} from "./manage-queue/setting/child-queue-manager/child-queue-list/child-queue-qrcode/child-queue-qrcode.component";
import {EditBaseInfoComponent} from "./manage-queue/setting/edit-base-info/edit-base-info.component";
import {EditQueueDescComponent} from "./manage-queue/setting/edit-base-info/edit-queue-desc/edit-queue-desc.component";
import {
  EditReminderTextComponent
} from "./manage-queue/setting/edit-base-info/edit-reminder-text/edit-reminder-text.component";
import {EditNickNameComponent} from "./manage-queue/setting/edit-base-info/edit-nick-name/edit-nick-name.component";
import {
  DiscoveryManagerComponent
} from "./manage-queue/setting/edit-base-info/discovery-manager/discovery-manager.component";
import {ExportExcelComponent} from "./manage-queue/send/ticket-list/export-excel/export-excel.component";
import {TransferQueueComponent} from "./manage-queue/setting/edit-base-info/transfer-queue/transfer-queue.component";
import {
  ScanTransferQueueComponent
} from "./manage-queue/setting/edit-base-info/transfer-queue/scan-transfer-queue/scan-transfer-queue.component";
import {
  TransferQueueScanResultComponent
} from "./manage-queue/setting/edit-base-info/transfer-queue/scan-transfer-queue/transfer-queue-scan-result/transfer-queue-scan-result.component";
import {SurveyStatsComponent} from "./manage-queue/setting/survey/survey-stats/survey-stats.component";
import {EditQueueNameComponent} from "./manage-queue/setting/edit-base-info/edit-queue-name/edit-queue-name.component";

const routes: Routes = [
  // {path: ':id', component: ManageQueueComponent, canActivate: [AuthGuardService]},
  // {path: ':id/:date', component: ManageQueueComponent, canActivate: [AuthGuardService]},
  {path: 'home', component: LeaderHomeComponent, canActivate: [AuthGuardService]},
  {path: 'manage-queue/:id', component: ManageQueueComponent, canActivate: [AuthGuardService]},
  {path: 'manage-queue/:id/:date', component: ManageQueueComponent, canActivate: [AuthGuardService]},
  {path: 'leader-scan', component: LeaderScanComponent, canActivate: [AuthGuardService]},
  {path: 'edit-base-info/:id', component: EditBaseInfoComponent, canActivate: [AuthGuardService]},
  {path: 'edit-queue-name/:id', component: EditQueueNameComponent, canActivate: [AuthGuardService]},
  {path: 'edit-queue-desc/:id', component: EditQueueDescComponent, canActivate: [AuthGuardService]},
  {path: 'edit-reminder-text/:id', component: EditReminderTextComponent, canActivate: [AuthGuardService]},
  {path: 'edit-nick-name/:id', component: EditNickNameComponent, canActivate: [AuthGuardService]},
  {path: 'discovery-manager/:id', component: DiscoveryManagerComponent, canActivate: [AuthGuardService]},
  {path: 'transfer-queue/:id', component: TransferQueueComponent, canActivate: [AuthGuardService]},
  {path: 'scan-transfer-queue', component:  ScanTransferQueueComponent, canActivate: [AuthGuardService]},
  {path: 'transfer-queue-scan-result/:targetQueueId', component:  TransferQueueScanResultComponent, canActivate: [AuthGuardService]},

  {path: 'survey-list/:queueId', component: SurveyListComponent, canActivate: [AuthGuardService]},
  {path: 'build-survey/:queueId/:surveyId/:type', component: BuildSurveyComponent, canActivate: [AuthGuardService]},
  {path: 'preview-survey/:surveyId', component: PreviewSurveyComponent, canActivate: [AuthGuardService]},
  {path: 'survey-stats/:queueId/:surveyId', component: SurveyStatsComponent, canActivate: [AuthGuardService]},
  {path: 'survey-stats/:queueId/:surveyId/:ticketDate', component: SurveyStatsComponent, canActivate: [AuthGuardService]},
  {path: 'add-question/:queueId/:surveyId/:index/:type',component: AddQuestionComponent, canActivate: [AuthGuardService]},
  {path: 'tag-list/:queueId', component: TagListComponent, canActivate: [AuthGuardService]},
  {path: 'tag-rules/:queueId', component: TagRulesComponent, canActivate: [AuthGuardService]},
  {path: 'conflict-tag-group/:queueId', component: ConflictTagGroupComponent, canActivate: [AuthGuardService]},
  {path: 'save-conflict-tag-group/:queueId', component: SaveConflictTagGroupComponent, canActivate: [AuthGuardService]},
  {path: 'save-conflict-tag-group/:queueId/:index',component: SaveConflictTagGroupComponent,canActivate: [AuthGuardService]},
  {path: 'create-tag/:queueId', component: CreateTagComponent, canActivate: [AuthGuardService]},
  {path: 'edit-tag/:queueId/:index', component: EditTagComponent, canActivate: [AuthGuardService]},
  {path: 'manual-inform/:queueId', component: ManualInformComponent, canActivate: [AuthGuardService]},
  {path: 'save-inform/:queueId/:index', component: SaveManualInformComponent, canActivate: [AuthGuardService]},
  {path: 'save-inform/:queueId', component: SaveManualInformComponent, canActivate: [AuthGuardService]},
  {path: 'action-management/:queueId', component: ActionManagementComponent, canActivate: [AuthGuardService]},
  {path: 'ticket-with-tags/:queueId', component: TicketWithTagsComponent, canActivate: [AuthGuardService]},
  {path: 'status-questions/:queueId', component: StatusQuestionsComponent, canActivate: [AuthGuardService]},
  {path: 'ticket-list/:queueId', component: TicketListComponent, canActivate: [AuthGuardService]},
  {path: 'export-excel/:queueId', component: ExportExcelComponent, canActivate: [AuthGuardService]},
  // {path: 'queue-notification/:queueId', component: QueueNotificationComponent, canActivate: [AuthGuardService]},
  // {path: 'sms-notification/:queueId', component: SmsComponent, canActivate: [AuthGuardService]},
  // {path: 'sms-send-record', component: SmsSendRecordComponent, canActivate: [AuthGuardService]},
  // {path: 'sms-send-record/:queueId', component: SmsSendRecordComponent, canActivate: [AuthGuardService]},
  // {path: 'sms-send-record-detail/:queueId/:id',component: SmsSendRecordDetailComponent,canActivate: [AuthGuardService]},
  // {path: 'vms-notification/:queueId', component: VmsComponent, canActivate: [AuthGuardService]},
  // {path: 'vms-send-record', component: VmsSendRecordComponent, canActivate: [AuthGuardService]},
  // {path: 'vms-send-record/:queueId', component: VmsSendRecordComponent, canActivate: [AuthGuardService]},
  // {path: 'vms-send-record-detail/:queueId/:id',component: VmsSendRecordDetailComponent,canActivate: [AuthGuardService]},
  {path: 'member-options/:queueId', component: MemberOptionsComponent, canActivate: [AuthGuardService]},
  {path: 'member-login-options/:queueId', component: MemberLoginOptionsComponent, canActivate: [AuthGuardService]},
  {path: 'member-ticket-setting/:queueId', component: MemberTicketSettingComponent, canActivate: [AuthGuardService]},
  {path: 'ticket-taken-rule/:queueId', component: TicketTakenRuleComponent, canActivate: [AuthGuardService]},
  {path: 'save-ticket-taken-rule-item/:queueId/:index',component: SaveTicketTakenRuleItemComponent,canActivate: [AuthGuardService]},
  {path: 'save-ticket-taken-rule-item/:queueId', component: SaveTicketTakenRuleItemComponent, canActivate: [AuthGuardService]},
    {path: 'service-time-manager/:queueId', component: ServiceTimeManagerComponent, canActivate: [AuthGuardService]},
  {path: 'auto-trigger/:queueId', component: AutoTriggerComponent, canActivate: [AuthGuardService]},
  // {path: 'save-auto-trigger/:queueId', component: SaveAutoTriggerComponent, canActivate: [AuthGuardService]},
  {path: 'manual-trigger/:queueId', component: ManualTriggerComponent, canActivate: [AuthGuardService]},
  {path: 'save-manual-trigger/:queueId', component:  SaveManualTriggerComponent, canActivate: [AuthGuardService]},
  {path: 'save-manual-trigger/:queueId/:index', component:  SaveManualTriggerComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard-manager/:queueId', component:  DashboardManagerComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard-template-list/:queueId', component: DashboardTemplateListComponent , canActivate: [AuthGuardService]},
  {path: 'save-dashboard-template/:queueId', component: SaveDashboardTemplateComponent , canActivate: [AuthGuardService]},
  {path: 'save-dashboard-template/:queueId/:index', component: SaveDashboardTemplateComponent , canActivate: [AuthGuardService]},
  {path: 'dashboard-item-list/:queueId', component: DashboardItemListComponent , canActivate: [AuthGuardService]},
  {path: 'save-dashboard-item/:queueId', component: SaveDashboardItemComponent , canActivate: [AuthGuardService]},
  {path: 'save-dashboard-item/:queueId/:index', component: SaveDashboardItemComponent , canActivate: [AuthGuardService]},
  {path: 'dashboard/:queueId/:index', component: DashboardComponent , canActivate: [AuthGuardService]},
  {path: 'board-cast-manager/:queueId', component:  BoardCastManagerComponent, canActivate: [AuthGuardService]},

  {path: 'child-queue-manager/:queueId', component:  ChildQueueManagerComponent, canActivate: [AuthGuardService]},
  {path: 'child-queue-list/:queueId', component:  ChildQueueListComponent, canActivate: [AuthGuardService]},
  {path: 'save-child-queue/:queueId/:index', component:  SaveChildQueueComponent, canActivate: [AuthGuardService]},
  {path: 'scan-child-queue/:queueId', component:  ScanChildQueueComponent, canActivate: [AuthGuardService]},
  {path: 'child-queue-qrcode/:queueId', component:  ChildQueueQrcodeComponent, canActivate: [AuthGuardService]},
  {path: 'child-queue-scan-result/:queueId/:targetQueueId', component:  ChildQueueScanResultComponent, canActivate: [AuthGuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueOwnerRoutingModule { }
