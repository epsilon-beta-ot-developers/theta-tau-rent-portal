import { Provider } from "react-redux";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./sass/custom.scss";
import "./index.scss";
import App from "./App";
import store from "./store";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
