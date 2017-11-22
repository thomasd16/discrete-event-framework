import { observable } from "mobx";
export class EventNode {
  readonly id:number;
  @observable x: number;
  @observable y: number;
  @observable r = 30;
  constructor(x: number, y: number, id:number) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}