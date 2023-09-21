import {Result} from "./Result";

export class RuleResultVo extends  Result{
  ruleFireStatus:RuleFireStatus=RuleFireStatus.SUCCESS;
  queueName: string;
  remark: string;
  ruleResultVos:RuleResultVo[]=[];
}
export enum RuleFireStatus{
  SUCCESS="SUCCESS",
  FAIL="FAIL"
}
