export class Answer{
  text: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
