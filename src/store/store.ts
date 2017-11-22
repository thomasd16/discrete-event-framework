import { action } from "mobx";
import { UiState } from "./uiState";
import { ViewPort } from "./viewport";
import { EventNode } from "./eventNode";
import { observable } from "mobx";
export class Store {
  private nodeId = 0;
  uiState = new UiState();
  viewPort = new ViewPort();
  @observable.ref eventNodes: { [id: number]: EventNode } = {};
  @action.bound addNode(x: number, y: number) {
    const newNode = new EventNode(x, y, this.nodeId++);
    this.eventNodes = { ...this.eventNodes, [newNode.id]: newNode };
  }
}