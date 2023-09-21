import {RadioOption} from "./RadioOption";

export class MultipleChoiceQuestion{
  question: string;
  radioOptions: RadioOption[] = [];
  answer: string[]=[];

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
