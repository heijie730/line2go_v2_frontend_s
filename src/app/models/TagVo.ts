import {Result} from "./Result";
import {Tag} from "./QueueVo";

export class TagVo extends Result {
  queueId: string
  tagContent: string
  tagDesc: string
  color: string
  checked: boolean = false;
  index: number;
  tags: Tag[];

  toTag() {
    let tag = new Tag();
    Object.assign(tag, this);
    return tag;
  }
}
