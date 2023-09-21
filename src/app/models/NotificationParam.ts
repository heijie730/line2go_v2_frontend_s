import {BaseNotification, Tag} from "./QueueVo";
import {QuestionType} from "./survey/Question";
import {TicketVo} from "./TicketVo";

export class NotificationParam {
  placeholder: string;
  name: string;
  value: string;
  exampleValue: string;
  editable: boolean = false;
  tags: Tag[] = [];
}

export class NotificationTemplate {
  template: string;
  notificationParams: NotificationParam[] = [];
  preview: string;
  templateType: TemplateType;
  templateName: TemplateName;

  toVoiceText(ticketVo: TicketVo): string {
    let notificationParams = this.notificationParams;
    let voiceText = this.template;
    let ticketNo = ticketVo.ticketNo;
    //fixme 这个姓名标签应该在取号的时候设置到ticket上，这里只获取ticket的姓名就可以了
    for (let notificationParam of notificationParams) {
      let tags = notificationParam.tags;
      let filledSurveyVo = ticketVo.ticketUserInfo.filledSurveyVo;
      if (notificationParam.placeholder == "{0}") {
        voiceText = voiceText.replace(notificationParam.placeholder, ticketNo + "");
        continue;
      }
      if (filledSurveyVo) {
        for (let page of filledSurveyVo.survey.pages) {
          let element = page.elements[0];
          let question = element.question;
          if (question.type == QuestionType.SHORT_TEXT) {
            const shortText = question.shortText;
            let shortTextTags = shortText.tags;
            if (shortTextTags && shortTextTags.length > 0) {
              let allTags = shortTextTags.concat(ticketVo.tags);
              let every = tags.every(tag => allTags.map(x => x.tagContent).includes(tag.tagContent));
              if (every) {
                voiceText = voiceText.replace(notificationParam.placeholder, shortText.answer);
                break;
              }
            }
          }
        }
      }
    }
    //替换掉无效占位符如{1}{2}等，因为有可能设置了占位符，但是问卷却没找到相应的信息。
    let newStr = voiceText.replace(/{.*?}/g, '');
    return newStr;
  }

}

export enum TemplateType {
  // SMS = "SMS",
  // VMS = "VMS",
  BOARD_CAST = "BOARD_CAST",
  VOICE_BOARD_CAST = "VOICE_BOARD_CAST",
  PRIVATE_MSG = "PRIVATE_MSG",
  EMAIL_MSG = "EMAIL_MSG"
}

export enum TemplateName {
  NONE = "NONE",
  VOICE_BOARD_CAST_TURN = "VOICE_BOARD_CAST_TURN",
  VOICE_BOARD_CAST_END = "VOICE_BOARD_CAST_END",
  VOICE_BOARD_CAST_EMPTY = "VOICE_BOARD_CAST_EMPTY",
  BOARD_CAST_TURN = "BOARD_CAST_TURN",
  BOARD_CAST_END = "BOARD_CAST_END",
  // VMS_TURN = "VMS_TURN",
  PRIVATE_MSG_TURN = "PRIVATE_MSG_TURN",
  PRIVATE_MSG_END = "PRIVATE_MSG_END",
  EMAIL_TURN = "EMAIL_TURN",
  EMAIL_END = "EMAIL_END",

}

export function findTemplate(templateName: TemplateName): BaseNotification {
  let notificationTemplates = templateList().filter(x => x.templateName == templateName);
  let notificationTemplate = notificationTemplates[0];
  let notificationInterface = new BaseNotification();
  notificationInterface.template = notificationTemplate;
  notificationInterface.enable = false;
  return notificationInterface;
}

function templateList(): NotificationTemplate[] {
  let turnVoiceBoardCast = buildTurnVoiceBoardCastTemplate();
  let endVoiceBoardCast = buildEndVoiceBoardCastTemplate();
  let turnBoardCast = buildTurnBoardCastMsgTemplate();
  let endBoardCast = buildEndBoardCastMsgTemplate();

  let EmptyVoiceBoardCast = buildEmptyVoiceBoardCastTemplate();
  let turnPrivateMsg = buildTurnPrivateTemplate();
  let endPrivateMsg = buildEndPrivateTemplate();
  let none = new NotificationTemplate();
  none.templateName = TemplateName.NONE;
  let templateList = [];
  templateList.push(none,  turnVoiceBoardCast, endVoiceBoardCast, turnBoardCast, endBoardCast
    , EmptyVoiceBoardCast,  turnPrivateMsg, endPrivateMsg);
  return templateList;
}
export function findSystemParam(type: TemplateType): NotificationTemplate {
  let notificationTemplates = systemTemplateParamList().filter(x => x.templateType == type);
  return notificationTemplates[0];
}

function systemTemplateParamList(): NotificationTemplate[] {
  let boardCast = buildBoardCastMsgTemplate();
  let voiceBoardCast = buildEmptyVoiceBoardCastTemplate();
  let privateMsg = buildPrivateTemplate();
  let emailMsgTemplate = buildEmailMsgTemplate();
  let templateList = [];
  templateList.push(voiceBoardCast, boardCast,emailMsgTemplate
    , privateMsg);
  return templateList;
}

function buildEmptyVoiceBoardCastTemplate(): NotificationTemplate {
  const template = new NotificationTemplate();
  const param = new NotificationParam();
  param.placeholder = "{0}";
  param.name = "Member Ticket Number";
  param.exampleValue = "3";
  param.editable = false;
  template.template = "No.{0}";
  template.templateType = TemplateType.VOICE_BOARD_CAST;
  template.templateName = TemplateName.VOICE_BOARD_CAST_EMPTY;
  template.notificationParams = [param];
  return template;
}


function buildTurnVoiceBoardCastTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "It's now the turn of {0} {1}";
  notificationTemplate.templateType = TemplateType.VOICE_BOARD_CAST;
  notificationTemplate.templateName = TemplateName.VOICE_BOARD_CAST_TURN;
  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Queue Member Ticket Number";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  const param2 = new NotificationParam();
  param2.placeholder = "{1}";
  param2.name = "Name";
  param2.exampleValue = "Frank Lin";
  param2.editable = true;
  param2.tags.push(Tag.onUserNameTag());
  notificationParams.push(param2);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildEndVoiceBoardCastTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Ticket Number {0} {1} has ended";
  notificationTemplate.templateType = TemplateType.VOICE_BOARD_CAST;
  notificationTemplate.templateName = TemplateName.VOICE_BOARD_CAST_END;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Ticket Number";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  const param2 = new NotificationParam();
  param2.placeholder = "{1}";
  param2.name = "Name";
  param2.exampleValue = "Wang Dachui";
  param2.editable = true;
  param2.tags.push(Tag.onUserNameTag());
  notificationParams.push(param2);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildBoardCastMsgTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "It's now the turn for number {0}";
  notificationTemplate.templateType = TemplateType.BOARD_CAST;
  notificationTemplate.templateName = TemplateName.NONE;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Ticket Number";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildTurnBoardCastMsgTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Now it's the turn of Ticket Number {0}";
  notificationTemplate.templateType = TemplateType.BOARD_CAST;
  notificationTemplate.templateName = TemplateName.BOARD_CAST_TURN;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Ticket Number";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildEndBoardCastMsgTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Ticket Number {0} has ended";
  notificationTemplate.templateType = TemplateType.BOARD_CAST;
  notificationTemplate.templateName = TemplateName.BOARD_CAST_END;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Ticket Number";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildTurnEmailMsgTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "现在轮到{0}号";
  notificationTemplate.templateType = TemplateType.EMAIL_MSG;
  notificationTemplate.templateName = TemplateName.EMAIL_TURN;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "队员排号";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildEndEmailMsgTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "{0}号已结束";
  notificationTemplate.templateType = TemplateType.EMAIL_MSG;
  notificationTemplate.templateName = TemplateName.EMAIL_END;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "队员排号";
  param1.exampleValue = "3";
  notificationParams.push(param1);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

export function buildEmailMsgTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Queue [{0}], your ticket number is {1}";
  notificationTemplate.templateType = TemplateType.EMAIL_MSG;
  notificationTemplate.templateName = TemplateName.NONE;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Queue Name";
  param1.exampleValue = "Queue for Ticket";
  notificationParams.push(param1);
  const param2 = new NotificationParam();
  param2.placeholder = "{1}";
  param2.name = "Ticket Number";
  param2.exampleValue = "No.3";
  notificationParams.push(param2);
  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildPrivateTemplate() {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Queue: {0}, your ticket number is {1}";
  notificationTemplate.templateType = TemplateType.PRIVATE_MSG;
  notificationTemplate.templateName = TemplateName.NONE;

  const notificationParams = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Queue Name";
  param1.exampleValue = "Queue for Ticket";
  notificationParams.push(param1);
  const param2 = new NotificationParam();
  param2.placeholder = "{1}";
  param2.name = "Ticket Number";
  param2.exampleValue = "No.3";
  notificationParams.push(param2);
  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

export function buildTurnPrivateTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Queue [{0}], your Ticket Number is {1}, it's your turn now";
  notificationTemplate.templateType = TemplateType.PRIVATE_MSG;
  notificationTemplate.templateName = TemplateName.PRIVATE_MSG_TURN;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Queue Name";
  param1.exampleValue = "Queue and Take Number";
  notificationParams.push(param1);

  const param2 = new NotificationParam();
  param2.placeholder = "{1}";
  param2.name = "Ticket Number";
  param2.exampleValue = "No.3";
  notificationParams.push(param2);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}

function buildEndPrivateTemplate(): NotificationTemplate {
  const notificationTemplate = new NotificationTemplate();
  notificationTemplate.template = "Queue [{0}], your Ticket Number is {1}, it has ended";
  notificationTemplate.templateType = TemplateType.PRIVATE_MSG;
  notificationTemplate.templateName = TemplateName.PRIVATE_MSG_END;

  const notificationParams: NotificationParam[] = [];
  const param1 = new NotificationParam();
  param1.placeholder = "{0}";
  param1.name = "Queue Name";
  param1.exampleValue = "Queue and Take Number";
  notificationParams.push(param1);

  const param2 = new NotificationParam();
  param2.placeholder = "{1}";
  param2.name = "Ticket Number";
  param2.exampleValue = "No.3";
  notificationParams.push(param2);

  notificationTemplate.notificationParams = notificationParams;
  const collect = notificationParams.map((param) => param.exampleValue);
  const content = notificationTemplate.template.replace(/{(\d+)}/g, (match, index) => collect[index - 1]);
  notificationTemplate.preview = content;
  return notificationTemplate;
}
