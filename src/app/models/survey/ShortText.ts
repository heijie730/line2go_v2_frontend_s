import {Tag} from "../QueueVo";

export class ShortText {
  tags: Tag[];
  question: string="";
  answer: string="";
  rows:number=1;
  maxLength:number=100;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
