import {v4 as uuidv4} from "uuid";

export class RadioOption {

  text: string;
  selected: boolean = false;
  disabled: boolean = false;
  allowInput: boolean = false;
  id: string = uuidv4();

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
