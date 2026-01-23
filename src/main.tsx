import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./themes/muiTheme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "./features/Store";
//@ts-ignore
const googleId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
    <ThemeProvider theme={theme}>
         <AuthProvider>
       <GoogleOAuthProvider clientId={googleId}>
      <CssBaseline />
      <App />
      </GoogleOAuthProvider>
      </AuthProvider>
    </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
