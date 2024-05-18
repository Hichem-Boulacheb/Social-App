import React from "react";
import  ReactDOM  from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="1010234433795-e35vnc2oeaqlkqsr9dmgm367ir8do5p6.apps.googleusercontent.com" >
        <App />
      </GoogleOAuthProvider>   
    </BrowserRouter>  
  </React.StrictMode>
);

