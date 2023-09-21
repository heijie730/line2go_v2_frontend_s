import {QueueVo} from "../models/QueueVo";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {queue} from "rxjs";
import {QuestionType} from "../models/survey/Question";

@Injectable({
  providedIn: 'root',
})
export class CustomUtils {
  constructor() {
  }

  buildQueueUpUrl(queueVo: QueueVo, date: string): string {
    let memberLoginOptions = queueVo.memberOptions.memberLoginOptions;
    let urlParam = memberLoginOptions.toUrlParam();
    let param = urlParam ? '?' + urlParam : '';
    return environment.domain + '/member/queue-up/' + queueVo.id + '/' + date  + param;
  }

  // buildMiniAppPath(queueId:string, date: string): string {
  //   return `/pages/queue-up/queue-up?scene=${queueId}&date=${date}`;
  // }
  buildChildQueueUrl(queueId: string): string {
    return environment.domain + '/member/queue-up/' + queueId;
  }
  buildTransferQueueUrl(targetQueueId: string): string {
    return environment.domain + '/leader/transfer-queue-scan-result/' + targetQueueId;
  }
  isPageValid(page: any): boolean {
    if (page.elements[0].question.required) {
      if (page.elements[0].question.type === QuestionType.SHORT_TEXT) {
        return !!page.elements[0].question.shortText.answer ;
      } else if (page.elements[0].question.type === QuestionType.SINGLE_CHOICE_QUESTION) {
        return !!page.elements[0].question.singleChoiceQuestion.answer;
      } else if (page.elements[0].question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
        return page.elements[0].question.multipleChoiceQuestion.answer?.length > 0;
      }
      // Add more cases for other question types if needed
    }
    return true; // If not required, consider it valid
  }
}
