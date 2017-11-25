import * as React from "react";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import { autorun, observable, computed, action, reaction } from "mobx";
import { Store } from "../store/store";
import * as vec from "../util/vec";
import * as _ from "lodash";
import { EventNode, Connection } from "../store";
@inject("store") @observer
export class ConnectionView extends React.Component<{ id: number }> {
  constructor(props) {
    super(props);
    if (this.self.target === null) {
      //connection does not have a target and was just created
      reaction((disposer) => {
        if (!this.store.uiState.down) {
          disposer.dispose();
          if (this.hoveredCircle === null)
            this.store.removeConnection(props.id);
        }
        return this.hoveredCircle;
      }, (x) => this.self.target = x, { fireImmediately: true });
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
  @computed get origin() {
    const { x, y, r } = this.store.eventNodes[this.self.source];
    return { x, y, r };
  }
  @computed get targetNode() {
    return this.self.target === null ? null : this.store.eventNodes[this.self.target];
  }
  @computed get target() {
    const { x, y } = this.targetNode || this.store.uiState;
    return { x, y };
  }
  @computed get degDelta() {
    const deltaPer = Math.PI * 0.2;
    if (!this.targetNode) return 0;
    const { connections } = this.store;
    const { source: selfSource, target: selfTarget } = this.self;
    if (selfTarget === null)
      return 0;
    if (selfSource == selfTarget)
      return Math.PI * 0.25;
    const similar = _.toPairs<Connection>(connections)
      .map(([x, y]) => ({ ...y, id: +x }))
      .filter(({ id, source, target }) =>
        (target === selfTarget && source === selfSource) ||
        (target === selfSource && source === selfTarget))
      .sort(({ id }) => id);
    const sourcePosition = similar.findIndex(({ id }) => id === this.props.id);
    const delta = (sourcePosition - ((similar.length - 1) / 2)) * deltaPer;
    return selfSource > selfTarget ? delta : -delta;
  }
  @computed get angle() {
    const ret = vec.direction(vec.sub(this.origin, this.target));
    if (Number.isNaN(ret)) return 0;
    return ret;
  }
  @computed get originAngle() {
    return this.angle - this.degDelta;
  }
  @computed get targetAngle() {
    return (this.angle - Math.PI) + this.degDelta;
  }
  @computed get originPoint() {
    return vec.add(this.origin, vec.extendDirection(this.originAngle, this.origin.r));
  }
  @computed get targetPoint() {
    const { targetNode, target } = this;
    return targetNode ?
      vec.add(targetNode, vec.extendDirection(this.targetAngle, targetNode.r)) :
      target;
  }
  @computed get bezierDistance() {
    const { source, target } = this.self;
    if (source === target) return 100;
    return vec.distance(this.origin, this.target) * 0.3;
  }
  @computed get originBezier() {
    const { originPoint, originAngle, bezierDistance } = this;
    return vec.add(this.originPoint, vec.extendDirection(originAngle, bezierDistance));
  }
  @computed get targetBezier() {
    const { targetPoint, targetAngle, bezierDistance } = this;
    return vec.add(targetPoint, vec.extendDirection(targetAngle, bezierDistance));
  }
  @computed get path() {
    const {
      originPoint: { x: sx, y: sy },
      originBezier: { x: sbx, y: sby },
      targetBezier: { x: ebx, y: eby },
      targetPoint: { x: ex, y: ey }
    } = this;
    return `M ${sx} ${sy} C ${sbx} ${sby} , ${ebx} ${eby} , ${ex} ${ey}`;
  }
  render() {
    const { path } = this;
    return <path d={path} fill={"none"} stroke={"black"} />;
  }
}