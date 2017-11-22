import { store } from "./store";
import { App } from "./components/app";
import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles/style.scss";
const main = document.getElementById("main")!;
ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, main);