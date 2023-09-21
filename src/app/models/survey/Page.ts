import {Element} from "./Element";
import {Question} from "./Question";
import {v4 as uuidv4} from "uuid";

export class Page {
  num: number;
  elements: Element[] = this.buildElements();

  buildElements(): Element[] {
    let element = new Element();
    element.type = 'question';
    element.orderNo = 1;
    let question = new Question();
    // question.type = this.questionType;
    question.required = true;
    question.name = uuidv4();
    element.question = question;
    let ele = [];
    ele.push(element);
    return ele;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
