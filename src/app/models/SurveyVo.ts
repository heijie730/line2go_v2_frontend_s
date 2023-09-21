import {Result} from "./Result";
import {Survey} from "./survey/Survey";

export class SurveyVo extends Result {
  id: string;
  queueId: string;
  survey: Survey = new Survey();
  editable: boolean = true;
}
