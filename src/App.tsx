import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { addKeyboardFocusIndicators } from "@/utils/accessibility";

// Lazy loading das páginas para melhor performance
const Index = lazy(() => import("./pages/Index"));
const Frases = lazy(() => import("./pages/Frases"));
const Resumos = lazy(() => import("./pages/Resumos"));
const Favoritos = lazy(() => import("./pages/Favoritos"));
const Buscar = lazy(() => import("./pages/Buscar"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Contato = lazy(() => import("./pages/Contato"));
const Notificacoes = lazy(() => import("./pages/Notificacoes"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Componente de carregamento acessível
const PageLoader = () => (
  <div 
    className="min-h-screen flex items-center justify-center"
    role="status"
    aria-label="Carregando página"
  >
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Inicializar indicadores de foco para acessibilidade
addKeyboardFocusIndicators();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/frases" element={<Frases />} />
            <Route path="/resumos" element={<Resumos />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
