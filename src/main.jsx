import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "@/context";
import { ErrorBoundary } from "@/components";
import { OverlayProvider } from "@/context";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
      <ToastProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
      </ToastProvider>
      </OverlayProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
