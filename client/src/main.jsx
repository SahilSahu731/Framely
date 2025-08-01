import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.js";
import { SocketContextProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketContextProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
