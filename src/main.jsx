import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";

import { RouterProvider } from "react-router/dom";
import { router } from "./routes/router.jsx";
import ThemeProvider from "./contexts/ThemeContext/ThemeContext.jsx";
import AuthProvider from "./contexts/AuthContext/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoleProvider } from "./contexts/RoleContext/RoleContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
