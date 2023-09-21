import {Result} from "./Result";

export class BoardCastLogVo extends Result {
  id: string;
  queueId: string;
  nickName: string;
  createDateTime:Date;
  date: string;
  members: number[];
  text: string;
  type: BoardCastType;
  boardCastLogVos:BoardCastLogVo[];

  title: string;
  role:RoleEnum;
  ticketNo:number;
}

export enum BoardCastType {
  CUSTOM_MESSAGE = "CUSTOM_MESSAGE",
  QUEUE_INFO = "QUEUE_INFO"
}

export enum RoleEnum {
  LEADER = "LEADER",
  MEMBER = "MEMBER"
}
