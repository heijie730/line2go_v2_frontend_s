import {Result} from "./Result";
import {Tag} from "./QueueVo";

export class TagTicketVo extends Result {
  queueId:string
  ids: string[];
  tags: Tag[];
}
