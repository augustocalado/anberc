import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Orcamentos from "./pages/Orcamentos";
import OS from "./pages/OS";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Contratos from "./pages/Contratos";
import Login from "./pages/Login";
import Agendamento from "./pages/Agendamento";
import VisitaTecnica from "./pages/VisitaTecnica";
import Contact from "./pages/Contact";
import Sobre from "./pages/Sobre";
import Usuarios from "./pages/Usuarios";
import ServicosLocalidade from "./pages/ServicosLocalidade";
import SeoManagement from "./pages/SeoManagement";
import { SessionProvider } from "./components/SessionProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
            <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path="/seo" element={<ProtectedRoute><SeoManagement /></ProtectedRoute>} />
            <Route path="/servicos/:city" element={<ServicosLocalidade />} />
            <Route path="/servicos/:city/:neighborhood" element={<ServicosLocalidade />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/orcamentos" element={<ProtectedRoute><Orcamentos /></ProtectedRoute>} />
            <Route path="/os" element={<ProtectedRoute><OS /></ProtectedRoute>} />
            <Route path="/contratos" element={<ProtectedRoute><Contratos /></ProtectedRoute>} />
            <Route path="/agendamento" element={<ProtectedRoute><Agendamento /></ProtectedRoute>} />
            <Route path="/visita-tecnica" element={<ProtectedRoute><VisitaTecnica /></ProtectedRoute>} />
            <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionProvider>
);

export default App;