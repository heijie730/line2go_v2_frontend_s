import {Result} from "./Result";

export class NotificationVo extends Result {
  id: string;
  requestId:string;
  title: string;
  content: string;
  htmlContent: string;
  userId: string;
  createDateTime: Date;
  checked: boolean;
  statusEnum:string;

}
