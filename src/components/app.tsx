import * as React from "react";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import { observable, computed, action } from "mobx";
import { Store } from "../store/store";
@inject("store") @observer
export class App extends React.Component {
  @computed get store() { return (this.props as any).store as Store; }
  @action.bound fitWindow() {
    const { clientWidth, clientHeight } = document.documentElement;
    const viewport = this.store.viewPort;
    viewport.width = clientWidth;
    viewport.height = clientHeight;
  }
  @action.bound resize = debounce(() => {
    this.fitWindow();
  }, 500);
  @action.bound mouseMove(e: MouseEvent) {
    const { clientX, clientY } = e;
    const uistate = this.store.uiState;
    uistate.x = clientX;
    uistate.y = clientY;
  }
  @action.bound keyEvent(e: KeyboardEvent) {
    const { altKey, ctrlKey, shiftKey } = e;
    const uistate = this.store.uiState;
    uistate.ctrl = ctrlKey;
    uistate.alt = altKey;
    uistate.shift = shiftKey;
  }
  @action.bound blur(e: KeyboardEvent) {
    const uistate = this.store.uiState;
    uistate.ctrl = uistate.alt = uistate.shift = false;
  }
  @action.bound mouseDown() {
    const uistate = this.store.uiState;
    uistate.down = true;
  }
  @action.bound mouseUp() {
    const uistate = this.store.uiState;
    uistate.down = false;
  }
  componentWillMount() {
    this.fitWindow();
    const { blur, resize, mouseDown, mouseUp, mouseMove, keyEvent } = this;
    window.addEventListener("resize", resize, true);
    window.addEventListener("mousemove", mouseDown, true);
    window.addEventListener("mousedown", mouseDown, true);
    window.addEventListener("mouseup", mouseUp, true);
    window.addEventListener("keydown", keyEvent, true);
    window.addEventListener("keyup", keyEvent, true);
    window.addEventListener("blur", blur, true);
  }
  componentWillUnmount() {
    const { blur, resize, mouseDown, mouseUp, mouseMove, keyEvent } = this;
    window.removeEventListener("resize", resize, true);
    window.removeEventListener("mousemove", mouseDown, true);
    window.removeEventListener("mousedown", mouseDown, true);
    window.removeEventListener("mouseup", mouseUp, true);
    window.removeEventListener("keydown", keyEvent, true);
    window.removeEventListener("keyup", keyEvent, true);
    window.removeEventListener("blur", blur, true);
  }
  render() {
    const {height,width} = this.store.viewPort;
    return (
      <svg width={width} height={height}>
      </svg>
    );
  }
}