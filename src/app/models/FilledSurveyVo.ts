import {Result} from "./Result";
import {Survey} from "./survey/Survey";

export class FilledSurveyVo extends Result {
  id: string;
  queueId: string;
  survey: Survey = new Survey();
  userId: string;
  surveyId: string;

}
