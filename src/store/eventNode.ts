import { observable } from "mobx";
export class EventNode {
  @observable x: number;
  @observable y: number;
  @observable r = 30;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}