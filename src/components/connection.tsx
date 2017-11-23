import * as React from "react";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import { observable, computed, action, reaction } from "mobx";
import { Store } from "../store/store";
import * as vec from "../util/vec";
@inject("store") @observer
export class Connection extends React.Component<{ id: number }> {
  @computed get store() { return (this.props as any).store as Store; }
  @computed get self() { return this.store.connections[this.props.id]; }
  @computed get origin() {
    const { x, y, r } = this.store.eventNodes[this.self.source];
    return { x, y, r };
  }
  @computed get target() {
    const { x, y } = (this.self.target !== null ?
      this.store.eventNodes[this.self.target] : this.store.uiState);
    return { x, y };
  }
  @computed get targetPoint() {
    return this.target;
  }
  @computed get angle() {
    return vec.direction(vec.sub(this.origin, this.target));
  }
  @computed get origionPoint() {
    return vec.add(this.origin,vec.extendDirection(this.angle, this.origin.r));
  }
  @computed get path() {
    const {
      origionPoint: { x: startX, y: startY },
      targetPoint: { x: endX, y: endY }
    } = this;
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }
  render() {
    const { path } = this;
    return <path d={path} fill={"none"} stroke={"black"} />;
  }
}