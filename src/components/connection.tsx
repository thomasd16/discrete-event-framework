import * as React from "react";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import { autorun, observable, computed, action, reaction } from "mobx";
import { Store } from "../store/store";
import * as vec from "../util/vec";
import * as _ from "lodash";
import { EventNode } from "../store/eventNode";
@inject("store") @observer
export class Connection extends React.Component<{ id: number }> {
  constructor(props) {
    super(props);
    if (this.self.target === null) {
      //connection does not have a target and was just created
      reaction((disposer) => {
        if (!this.store.uiState.down) {
          disposer.dispose();
          if(this.hoveredCircle === null)
            this.store.removeConnection(props.id);
        }
        return this.hoveredCircle;
      }, (x) => this.self.target = x);
    }
  }
  @computed get store() { return (this.props as any).store as Store; }
  @computed get self() { return this.store.connections[this.props.id]; }
  @computed get hoveredCircle() {
    const {
      uiState,
      eventNodes } = this.store;
    const findResult = (_.toPairs<EventNode>(eventNodes).find(([_, x]) => vec.distance(uiState, x) <= x.r));
    return findResult ? +findResult[0] : null;
  }
  @computed get targetNode() {
    return this.self.target === null ? null : this.store.eventNodes[this.self.target];
  }
  @computed get origin() {
    const { x, y, r } = this.store.eventNodes[this.self.source];
    return { x, y, r };
  }
  @computed get target() {
    const { x, y } = this.targetNode || this.store.uiState;
    return { x, y };
  }
  @computed get targetPoint() {
    return this.target;
  }
  @computed get angle() {
    return vec.direction(vec.sub(this.origin, this.target));
  }
  @computed get origionPoint() {
    return vec.add(this.origin, vec.extendDirection(this.angle, this.origin.r));
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