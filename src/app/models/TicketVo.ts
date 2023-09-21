import {Result} from "./Result";
import {Tag} from "./QueueVo";
import {FilledSurveyVo} from "./FilledSurveyVo";

export class TicketVo extends Result {
  id: string;
  ticketNo: number;
  queueId: string;
  queueName: string;

  ticketDate: string;
  ticketVos: TicketVo[] = [];
  busKey: string;
  imgData: any;
  tags: Tag[];
  checked: boolean;
  ticketCustomInfo: TicketCustomInfo = new TicketCustomInfo();
  ticketUserInfo: TicketUserInfo = new TicketUserInfo();
  ticketServiceTime: TicketServiceTime;
  keyword: string;
  searchOption: SearchOption;
  dashboardMessage: string;
  errors:string[];

}

export class SearchOption {
  searchOptionEnumList: string[] = SearchOptionVo.toDefaultSearchOptionVoList().map(x => x.key);
}

export class SearchOptionVo {
  key: string;
  value: string;
  checked: boolean;


  public static toDefaultSearchOptionVoList(): SearchOptionVo[] {
    return Object.keys(SearchOptionEnum).map(key => ({
      key: key as SearchOptionEnum,
      value: SearchOptionEnum[key as keyof typeof SearchOptionEnum], // 使用类型断言
      checked: true
    }));
  }

}

export enum SearchOptionEnum {
  TICKET_NO = "Ticket Number",
  USERNAME = "Name",
  TICKET_SERVICE_TIME = "Service Time"
}

export class TicketServiceTime {
  ticketNo: number;
  startTime: string;
  endTime: string;
}

export class TicketUserInfo {
  requestId: string;
  takenDateTime:Date;
  userName: string;
  status: StatusEnum;
  filledSurveyVo: FilledSurveyVo;
}

export enum StatusEnum {
  USE = "USED", NOTIFIED = "NOTIFIED"
}

export class TicketCustomInfo {
  titleName:string;
  dateName:string;
  remarkName: string;
  remark: string;
}

export class TicketSearchVo {
  queueId: string;
  ticketDate: string;
  filterTags: Tag[];
  // excludeTags: Tag[];
  keyword: string;
  searchOption: SearchOption;
  filterTagOption: FilterTagOption;
}

export enum FilterTagOption {
  INCLUDE = "INCLUDE",
  EXCLUDE = "EXCLUDE",
}
