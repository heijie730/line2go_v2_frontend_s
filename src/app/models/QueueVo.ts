import {Result} from "./Result";
import {TagVo} from "./TagVo";
import {buildTurnPrivateTemplate, NotificationParam, NotificationTemplate, TemplateType} from "./NotificationParam";
import {Expose, Transform, Type} from "class-transformer";
import {TicketServiceTime, TicketVo} from "./TicketVo";
import {Point} from "@angular/cdk/drag-drop";
import {AwsService} from "../_services/aws-service.service";
import {DateTimeUtils} from "../_utils/dateTimeUtils";

export class QueueVo extends Result {
  id: string;
  queueName: string;
  timeZone:string;
  // miniAppS3Key: string;
  // miniAppUrl: string;
  // createdDate: Date;
  userId: string;
  // phone:string;
  email:string;
  nickName: string;
  createDateTime: number;
  reminderText: string;
  surveyPoId: string;
  allowUserCreateTicket: boolean;
  // informItems: InformItem[];
  @Type(() => ManualNotification)
  manualNotification: ManualNotification;
  generateTicketManager: GenerateTicketManager = new GenerateTicketManager();
  ticketTakenRuleManager: TicketTakenRuleManager;
  queueVos: QueueVo[];
  @Type(() => Tag)
  tags: Tag[];
  tagRules: TagRules;
  statusByMember: StatusByMember;
  // queueNotification: QueueNotification;
  @Type(() => MemberOptions)
  memberOptions: MemberOptions;
  effectDay: string;
  serviceTimeManager: ServiceTimeManager;
  @Type(() => DashboardManager)
  dashboardManager: DashboardManager;
  boardCastManager: BoardCastManager;
  childQueueManager: ChildQueueManager;
  @Type(() => DiscoveryManager)
  discoveryManager:DiscoveryManager;
}
export class DiscoveryManager{
  enableQueueName:boolean;
  // enablePhone:boolean;
  enableEmail:boolean;
  @Type(() => LocationItem)
  // locationItems:LocationItem[];
  locationItem:LocationItem;
}

export class LocationItem{
  enable:boolean;
  address:string;
  @Transform(({ value }) => {
    if (!value){
      return {};
    }
    return {
      x: value.x,
      y: value.y
    };
  })
  geoJsonPoint:GeoJsonPoint;
}
export class GeoJsonPoint{
  x: number;
  y: number;
}
export class ChildQueueManager {
  password: string;
  childQueues: ChildQueue[];
}

export class ChildQueue {
  queueId: string;
  queueName: string;
  createDateTime: Date;
  remark: string;
}

export class BoardCastManager {
  allowMemberPublishAny: boolean;
  allowMemberPublishSpecify: boolean;
  boardCastQuestions: BoardCastQuestion[];
}

export class BoardCastQuestion {
  question: string;
}

export class DashboardManager {
  @Type(() => DashboardTemplate)
  dashboardTemplateList: DashboardTemplate[] = [];
  @Type(() => DashboardItem)
  dashboardItemList: DashboardItem[] = [];
}

export class DashboardTemplate implements Point, UserImageInterface {
  title: string;
  width: number = 400;
  height: number = 400;
  @Type(() => DashboardItem)
  dashboardItemList: DashboardItem[] = [];
  // dashboardTemplateList: DashboardTemplate[] = [];
  x: number = 0;
  y: number = 0;
  key: string;
  fileName: string;
}

export interface UserImageInterface {
  key: string;
  fileName: string;
}

export enum DashboardEnum {
  DASHBOARD_PRO = "DASHBOARD_PRO",
  DASHBOARD_EDIT = "DASHBOARD_EDIT",
  TEMPLATE_EDIT = "TEMPLATE_EDIT",
  ITEM_EDIT = "ITEM_EDIT",

}

export class DashboardItem implements Point {
  title: string;
  width: number = 200;
  height: number = 200;
  opacity: number = 100;
  border: boolean = true;
  shadow: boolean = true;
  dashboardItemEnum: DashboardItemEnum;
  x: number = 0;
  y: number = 0;
  customContentSetting: CustomContentSetting = new CustomContentSetting();
  @Type(() => TicketTakenListSetting)
  ticketTakenListSetting: TicketTakenListSetting = new TicketTakenListSetting();
  userImageSetting: UserImageSetting = new UserImageSetting();
  @Type(() => TicketTakenListSetting)
  boardCastSetting: BoardCastSetting = new BoardCastSetting();
}

export class UserImageSetting implements UserImageInterface {
  key: string;
  fileName: string;
}

export class BoardCastSetting {
  @Type(() => DateType)
  dateType: DateType = new DateType();
  tableBorder: boolean = true;
  page: number = 0;
  size: number = 10;
}

export class TicketTakenListSetting {
  skip: number = 0;
  size: number = 10;
  tableBorder: boolean = true;
  @Type(() => DateType)
  dateType: DateType = new DateType();
  @Type(() => TagMessage)
  tagMessages: TagMessage[] = TagMessage.defaultValues();
  displayRules: DisplayRule[] = DisplayRule.defaultValues();
}


export class DateType {
  dateTypeEnum: DateTypeEnum = DateTypeEnum.NOW;
  date: string;

   _date(timeZone?: string): string {
    return this.date ? this.date : DateTimeUtils.yyyyMMddFormat(new Date(),timeZone);
  }

  toDate(timeZone?:string): string {
    switch (this.dateTypeEnum) {
      case DateTypeEnum.NOW:
        return DateTimeUtils.yyyyMMddFormat(new Date(),timeZone);
      case DateTypeEnum.MANUAL_DAY:
        return this.date;
      default:
        return '';
    }
  }
}

export enum DateTypeEnum {
  NOW = "NOW",
  MANUAL_DAY = "MANUAL_DAY"

}

export class DisplayRule {
  tags: Tag[] = [];
  displayOptionEnum: DisplayOptionEnum;

  static defaultValues(): DisplayRule[] {
    return [
      {
        tags: [Tag.onTakenTag(), Tag.onInformTag()],
        displayOptionEnum: DisplayOptionEnum.SHOW
      },
      {
        tags: [Tag.onEndTag()],
        displayOptionEnum: DisplayOptionEnum.HIDE
      }
    ];
  }
}

export enum DisplayOptionEnum {
  HIDE = "HIDE",
  SHOW = "SHOW"

}

export class TagMessage {
  tags: Tag[] = [];
  message: string;
  @Type(() => VoiceBoardCast)
  voiceBoardCast: VoiceBoardCast = new VoiceBoardCast();

  static defaultValues(): TagMessage[] {
    let onGenerate = new TagMessage();
    onGenerate.message = "Waiting for your turn!";
    onGenerate.tags.push(Tag.onGenerateTag());
    let onTaken = new TagMessage();
    onTaken.message = "Please be patient!";
    onTaken.tags.push(Tag.onTakenTag());
    let onInform = new TagMessage();
    onInform.message = "It's your turn now!";
    onInform.tags.push(Tag.onInformTag());
    return [
      onGenerate, onTaken, onInform
    ];
  }


}

export class BaseNotification {
  template: NotificationTemplate = new NotificationTemplate();
  enable: boolean;
}

export class VoiceBoardCast extends BaseNotification {
  @Type(() => NotificationTemplate)
  override template: NotificationTemplate = VoiceBoardCast.defaultTemplate();
  playTimes: number = 2;
  volume: number = 1;// 音量（0到1之间的值）
  rate: number = 1;// 语速（0.1到10之间的值）
  pitch: number = 1; // 音调（0到2之间的值）
  override enable: boolean = false;

  static defaultTemplate(): NotificationTemplate {
    let template = new NotificationTemplate();
    let param = new NotificationParam();
    param.placeholder = "{0}";
    param.name = "Ticket Number";
    param.exampleValue = "3";
    param.editable = false;
    template.template = "No.{0}";
    template.notificationParams.push(param);
    template.templateType = TemplateType.VOICE_BOARD_CAST;
    return template;
  }
}

export class CustomContentSetting {
  content: string;
  fontSize: number;
}

export enum DashboardItemEnum {
  CUSTOM_CONTENT = 'CUSTOM_CONTENT',
  TICKET_TAKEN_LIST = 'TICKET_TAKEN_LIST',
  USER_IMAGE = 'USER_IMAGE',
  BOARD_CAST = 'BOARD_CAST'

}

export class TimeRange {
  startTime: string = '00:00:00';
  endTime: string = '23:59:59';
}

export class ServiceTimeManager {
  manualTriggerItemList: ManualTriggerServiceTimeItem[];
  autoTriggerItemList: AutoTriggerServiceTimeItem[];
}

export class AutoTriggerServiceTimeItem extends TimeRange {
  override startTime: string = '08:00:00';
  override endTime: string = '08:10:00';
  ticketNos: number[] = [1, 2, 3];
}

export class ManualTriggerServiceTimeItem extends TimeRange {
  tags: Tag[];//触发标签
  override startTime: string = '08:00:00';
  override endTime: string = '08:10:00';
}


export class MemberOptions {
  @Type(() => MemberLoginOptions)
  memberLoginOptions: MemberLoginOptions;
  ticketSetting: TicketSetting;
}

export class MemberLoginOptions {
  memberEmailLogin: boolean;
  memberVisitorLogin: boolean;
  googleLogin: boolean;


  toUrlParam(): string {
    let paramArray = [];
    // if (!this.memberPhoneLogin) {
    //   paramArray.push('notPhone=y');
    // }
    if (!this.memberEmailLogin) {
      paramArray.push('notEmail=y');
    }
    if (!this.memberVisitorLogin) {
      paramArray.push('notVisitor=y');
    }
    if (!this.googleLogin) {
      paramArray.push('notGoogle=y');
    }
    return paramArray.join('&');
  }
}

export class TicketSetting {
  downloadTicket: boolean = true;
  memberAttachTypeEnum: MemberAttachTypeEnum;
  refundTypeEnum: RefundTypeEnum;
}

export enum RefundTypeEnum {
  NOT_ALLOW_REFUND = "NOT_ALLOW_REFUND",
  REUSE_TICKET = "REUSE_TICKET",
  DELETE_TICKET = "DELETE_TICKET"
}

export enum MemberAttachTypeEnum {
  NOT_ALLOW_ATTACH = "NOT_ALLOW_ATTACH",
  APPEND = "APPEND",
  REPLACEMENT = "REPLACEMENT",
  UPDATE = "UPDATE"
}

// export class QueueNotification {
//   smsNotification: SmsNotification;
//   vmsNotification: VmsNotification;
// }

// export class SmsNotification {
//   enableSmsNotification: boolean;
// }
//
// export class VmsNotification {
//   enableVmsNotification: boolean;
// }

export class StatusByMember {
  statusByQuestions: StatusByQuestion[];
  allowMemberPublishStatus: boolean;
}

export class StatusByQuestion {
  question: string;
}

export class Tag {
  tagContent: string
  tagDesc: string
  color: string
  showInCanvas: boolean;
  createDateTime: Date;


  toTagVo(tags?: Tag[]) {
    let tagVo = new TagVo();
    tagVo.tagContent = this.tagContent;
    tagVo.tagDesc = this.tagDesc;
    tagVo.color = this.color;
    tagVo.checked = false;
    if (tags) {
      tagVo.checked = tags.some(tag => tag.tagContent === this.tagContent);
    }
    return tagVo;
  }

  static onGenerateTag(): Tag {
    let tag = new Tag();
    tag.tagContent = "Generated";
    tag.showInCanvas = false;
    tag.tagDesc = "Ticket has been generated";
    tag.color = "#007bff";
    return tag;
  }

  static onTakenTag(): Tag {
    let tag = new Tag();
    tag.tagContent = "Taken";
    tag.showInCanvas = true;
    tag.tagDesc = "Ticket has been taken";
    tag.color = "#6c757d";
    return tag;
  }

  static onInformTag(): Tag {
    let tag = new Tag();
    tag.tagContent = "Notified";
    tag.showInCanvas = true;
    tag.tagDesc = "The member has been notified";
    tag.color = "#28a745";
    return tag;
  }

  static onVipTag(): Tag {
    let tag = new Tag();
    tag.tagContent = "VIP";
    tag.showInCanvas = true;
    tag.tagDesc = "Use this tag in 'Tag Rules' and 'VIP Queue Rules'";
    tag.color = "#ffc107";
    return tag;
  }

  // static onSmsTag(): Tag {
  //   let tag = new Tag();
  //   tag.tagContent = "Phone Number";
  //   tag.showInCanvas = false;
  //   tag.tagDesc = "Use this tag in 'Action Management' and 'Manual Notification Templates'";
  //   tag.color = "#17a2b8";
  //   return tag;
  // }

  static onEndTag(): Tag {
    let tag = new Tag();
    tag.tagContent = "Ended";
    tag.showInCanvas = true;
    tag.tagDesc = "Use this tag in 'Action Management' and 'Ticket Taken Rule Templates'";
    tag.color = "#2e8500";
    return tag;
  }

  static onUserNameTag(): Tag {
    let tag = new Tag();
    tag.tagContent = "Name";
    tag.showInCanvas = false;
    tag.tagDesc = "Name";
    tag.color = "#4f7296";
    return tag;
  }

}

export class TagRules {
  conflictGroups: ConflictGroup[] = [];
}

export class GenerateTicketManager {
  ticketTitleName: string;
  ticketRemarkName: string;
  ticketDateName: string;
  tagsOnGenerate: Tag[] = [];
  ticketMsgManager: TicketMsgManager = new TicketMsgManager();
}

export class AfterTicketTaken {
  ticketTags: Tag[];
  ticketMsgManager: TicketMsgManager = new TicketMsgManager();
  userNameTags: Tag[];
  emailMsg:EmailMsg=new EmailMsg();
}

export class TicketMsgManager {
  content: string;
  attachTypeEnum: string;
}

export interface DateRangeInterface {
  dates: string[];
  dateDesc: string;

}

export class BeforeTicketTaken {
  ticketTakenSameTagRulePos: TicketTakenSameTagRulePo[] = [];
  ticketTakenVipRulePos: TicketTakenVipRulePo[] = [];
  ticketTakenTimeRangeRulePos: TicketTakenTimeRangeRulePo[] = [];
  ticketTakenPasswordRulePos: TicketTakenPasswordRulePo[] = [];
  ticketTakenDateRangeRulePos: TicketTakenDateRangeRulePo[] = [];
  ticketDateRulePos: TicketDateRulePo[] = [];

}

export class TicketDateRulePo implements DateRangeInterface {
  title: string = 'Allowed Usage Dates';
  ticketDateEnum: TicketDateEnum;
  dateDesc: string;
  dates: string[];
}

export enum TicketDateEnum {
  ANY = "ANY",
  MULTIPLE_DATE = "MULTIPLE_DATE",
  DAYS_FROM_NOW = "DAYS_FROM_NOW"
}

export class TicketTakenDateRangeRulePo implements DateRangeInterface {
  title: string = 'Allowed Ticket Taken Dates';
  dateRangeEnum: DateRangeEnum;
  dateDesc: string;
  dates: string[];
}


export enum DateRangeEnum {
  ANY = "ANY",
  MULTIPLE_DATE = "MULTIPLE_DATE",
  RANGE_DATE = "RANGE_DATE"
}

export class TicketTakenPasswordRulePo {
  title: string = 'Ticket Taken Password';
  tags: Tag[] = [];
  password: string;
  delimiter: string = ",";

}

export class TicketTakenVipRulePo {
  // enable: boolean = false;
  title: string = 'Vip Rule';
  tags: Tag[] = [];
}


export class TicketTakenTimeRangeRulePo extends TimeRange {
  title: string = 'Allowed Ticket Taken Time';
  override startTime: string = '00:00:00';
  override endTime: string = '23:59:59';
}

export class TicketTakenSameTagRulePo {
  title: string = 'Ticket Quota Tag Rule';
  // enable: boolean = false;
  tags: Tag[] = [];
  allowTakenCount: number;
  // startTime: string = '00:00:00';
  // endTime: string = '23:59:59';
}

export class ConflictGroup {
  tags: Tag[] = [];
}

export class UniqueGroup {
  tags: Tag[] = [];
}

export class ManualNotification {
  @Type(() => InformItem)
  informItems: InformItem[];
}

export class InformItem {
  title: string;
  informWithTags: Tag[];
  // smsTags: Tag[];
  // sendSms: SendSms = new SendSms();
  // sendVms: SendVms = new SendVms();
  boardCastMsg: BoardCastMsg = new BoardCastMsg();
  emailMsg:EmailMsg=new EmailMsg();
  privateMsg: PrivateMsg = PrivateMsg.defaultTurn();
  // wechatMpMsg: WechatMpMsg = new WechatMpMsg();
  ticketMsgManager: TicketMsgManager = new TicketMsgManager();
  @Type(() => VoiceBoardCast)
  voiceBoardCast: VoiceBoardCast = new VoiceBoardCast();
  // deleteTicket: boolean = false;
}

export class TicketTakenRuleManager {
  ticketTakenRuleItemList: TicketTakenRuleItem[] = [];
}

export class TicketTakenRuleItem {
  title: string;
  afterTicketTaken: AfterTicketTaken = new AfterTicketTaken();
  beforeTicketTaken: BeforeTicketTaken = new BeforeTicketTaken();
}

// export class WechatMpMsg extends BaseNotification {
//   // template: NotificationTemplate = new NotificationTemplate();
//   // enable: boolean;
// }

// export class SendVms extends BaseNotification {
//   // template: NotificationTemplate = new NotificationTemplate();
//   // enable: boolean;
//   playTimes: number;
// }

// export class SendSms extends BaseNotification {
//   tags: Tag[];
//   // template: NotificationTemplate = new NotificationTemplate();
//   // enable: boolean;
// }

export class BoardCastMsg extends BaseNotification {
  // template: NotificationTemplate = new NotificationTemplate();
  // enable: boolean;
}
export class EmailMsg extends BaseNotification {
  title: string;

}
export class PrivateMsg extends BaseNotification {
  title: string;
  override enable: boolean = true;

  public static defaultTurn(): PrivateMsg {
    let privateMsg = new PrivateMsg();
    privateMsg.title = "It's your turn now!";
    privateMsg.enable = true;
    privateMsg.template = buildTurnPrivateTemplate();
    return privateMsg;
  }
}
