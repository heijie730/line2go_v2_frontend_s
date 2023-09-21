import {Answer} from "./Answer";
import {RadioOption} from "./RadioOption";
import {ShortText} from "./ShortText";
import {SingleChoiceQuestion} from "./SingleChoiceQuestion";
import {MultipleChoiceQuestion} from "./MultipleChoiceQuestion";

export class Question {
  // text: string;
  type: QuestionType;
  required: boolean;
  // answer: Answer = new Answer();
  // radioOptions: RadioOption[] = [];
  name: string;
  shortText: ShortText = new ShortText();
  singleChoiceQuestion: SingleChoiceQuestion = new SingleChoiceQuestion();
  multipleChoiceQuestion: MultipleChoiceQuestion = new MultipleChoiceQuestion();

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }


}

export enum QuestionType {
  SHORT_TEXT = 'SHORT_TEXT', SINGLE_CHOICE_QUESTION = 'SINGLE_CHOICE_QUESTION',
  MULTIPLE_CHOICE_QUESTION = 'MULTIPLE_CHOICE_QUESTION'
}
