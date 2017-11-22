import { UiState } from "./uiState";
import { ViewPort } from "./viewport";
export class Store {
  uiState = new UiState();
  viewPort = new ViewPort();
}