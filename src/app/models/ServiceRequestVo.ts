import {Result} from "./Result";

export class ServiceRequestVo extends Result {
  id: string;
  userId: string;
  queueId: string;
  // dateTime: Date;
  lastModifiedDateTime:Date;
  userName: string;
  userChecked: boolean;
  adminChecked: boolean;
  title: string;
  // serviceRequestContent: ServiceRequestContent = new ServiceRequestContent();
  serviceRequestContents: ServiceRequestContent[] = [];
  serviceRequestVos: ServiceRequestVo[];
}

export class ServiceRequestContent {
  content: string;
  contentRole: string;
  dateTime: Date;
}
