import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//--------------Font--------------------//
import "@fontsource/poppins";
//--------------Store--------------------//
import { store } from "./store";
import { Provider } from "react-redux";
//-------------------------------------//

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <App />
  </Provider>
);
