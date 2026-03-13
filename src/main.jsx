import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import { RouterProvider } from "react-router/dom";
import { router } from './routes/router.jsx';
import ThemeProvider from './contexts/ThemeContext/ThemeContext.jsx';
import AuthProvider from './contexts/AuthContext/AuthContext.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
