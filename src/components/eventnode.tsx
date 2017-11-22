import * as React from "react";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import { observable, computed, action, reaction } from "mobx";
import { Store } from "../store/store";
@inject("store") @observer
export class EventNode extends React.Component<{ id: number }> {
  @computed get store() { return (this.props as any).store as Store; }
  @computed get self() { return this.store.eventNodes[this.props.id]; }
  @action.bound startDrag() {
    const uistate = this.store.uiState;
    const { x: startx, y: starty } = this.self;
    const { x: mousex, y: mousey } = uistate;
    const offsetX = startx - mousex;
    const offsetY = starty - mousey;
    reaction((disposer)=> {
      if(!uistate.down) disposer.dispose();
      const {x,y} = uistate;
      return ({
        x:x+offsetX,
        y:y+offsetY
      })
    },({x,y})=> {
      this.self.x = x;
      this.self.y = y;
    });
  }
  render() {
    const { x, y, r } = this.self;
    return (
      <g>
        <circle
          onMouseDown={this.startDrag}
          cx={x}
          cy={y}
          r={r}
          fill={"white"}
          stroke="black"
          strokeWidth="1"
        />
      </g>
    )
  }
}