import { observable } from "mobx";
export class UiState {
  @observable x = 0;
  @observable y = 0;
  @observable ctrl = false;
  @observable shift = false;
  @observable alt = false;
  @observable down = false;
}