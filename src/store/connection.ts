import {observable} from "mobx";
export class Connection {
  readonly source:number;
  @observable target:number|null = null;
  constructor(source:number) {
    this.source = source;
  }
}