import {Result} from "./Result";

export class ChildQueueVo extends Result {
  queueId: string;
  targetQueueId: string
  targetQueueName: string;
  remark:string;
  password: string;
}
