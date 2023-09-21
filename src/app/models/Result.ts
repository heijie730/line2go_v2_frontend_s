export class Result {
  errcode: number ;
  errmsg: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
