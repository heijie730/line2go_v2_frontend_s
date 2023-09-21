import {Result} from "./Result";

export class VerificationCodeVo extends Result{
  createDateTime:Date;
  queueId: string;
  code: string;
  codeType:CodeTypeEnum;
}
export enum CodeTypeEnum{
  REGISTRATION="REGISTRATION",
  // BIND_PHONE="BIND_PHONE",
  BIND_EMAIL="BIND_EMAIL",
  PASSWORD_RECOVERY="PASSWORD_RECOVERY",
  TRANSFER_QUEUE="TRANSFER_QUEUE",

}
