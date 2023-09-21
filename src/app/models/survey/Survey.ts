import {Page} from "./Page";

export class Survey {
  name: string;
  description: string;
  pages: Page[] = [];
  // open: boolean = false;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
