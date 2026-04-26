import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <SessionProvider>
      <App />
    </SessionProvider>
  </HelmetProvider>
);