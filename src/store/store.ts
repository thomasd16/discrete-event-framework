import { action } from "mobx";
import { UiState } from "./uiState";
import { ViewPort } from "./viewport";
import { EventNode } from "./eventNode";
import { Connection } from "./connection";
import { observable } from "mobx";
export class Store {
  private nodeId = 0;
  private connectionId = 0;
  readonly uiState = new UiState();
  readonly viewPort = new ViewPort();
  @observable.ref eventNodes: { [id: number]: EventNode } = {};
  @observable.ref connections: { [id: number]: Connection } = {};
  @action.bound addNode(x: number, y: number) {
    this.eventNodes = { ...this.eventNodes, [this.nodeId++]: new EventNode(x, y) };
  }
  @action.bound addConnection(sourceNode: number) {
    this.connections = { ...this.connections, [this.connectionId++]: new Connection(sourceNode) };
  }
  @action.bound removeConnection(id:number) {
    const {[id]:_,...next} = this.connections;
    this.connections = next;
  }
}