import {Result} from "./Result";
import {DashboardItem, DashboardTemplate} from "./QueueVo";

export class SystemParameterVo extends Result {
  id: string;
  parameterType: ParameterType;
  dashboardTemplates: DashboardTemplate[];
  dashboardItems:DashboardItem[];
  value:string;
}

export enum ParameterType {
  QUEUE_INIT_DASHBOARD_TEMPLATE = "QUEUE_INIT_DASHBOARD_TEMPLATE",
  QUEUE_INIT_DASHBOARD_ITEM = "QUEUE_INIT_DASHBOARD_ITEM",
  MINI_APP_LEADER_HOME_URL = "MINI_APP_LEADER_HOME_URL"

}
