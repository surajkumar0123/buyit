import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
        <CssBaseline />
        <BrowserRouter>
          {/* <div onContextMenu={(e) => e.preventDefault()}> */}
            <App />
          {/* </div> */}
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
