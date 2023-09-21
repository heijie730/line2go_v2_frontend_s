import {Result} from "./Result";

export class CheckTicketVo extends Result {
  ownQueue: boolean;
  queueName: string;
  ticketNo: number;
  date:string;
  queueId:string;
}
