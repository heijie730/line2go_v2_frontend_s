import {Question} from "./Question";

export class Element {
  orderNo: number;
  type: string;
  question: Question = new Question();

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
