import {Result} from "./Result";

export class RichTextVo extends Result {
  id: string;
  queueId: string;
  content: string;
  textType: TextType;
}

export enum TextType {
  QUEUE_DESC = "QUEUE_DESC",
  REMINDER_TEXT = "REMINDER_TEXT"
}
