import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Navbar from "./Components/Navbar/Navbar.jsx"
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-bsmubq3cydadzuu8.us.auth0.com"
    clientId="COxmegUpckF4QEhxZFTUIzYRcmCnpZWr"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    
    <App />
  </Auth0Provider>,
)
