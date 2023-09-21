import {Result} from "./Result";
import {InformItem, TicketTakenRuleItem, TagRules} from "./QueueVo";
import {BoardCastType, RoleEnum} from "./BoardCastLogVo";

export class InformMembersVo extends Result {
  id: string;
  members: number[];
  date: string ;
  nickName:string;
  informItem: InformItem;
  ticketIds:string[];
  type:BoardCastType;
  ticketTakenRuleItem:TicketTakenRuleItem;
  role:RoleEnum;

}
