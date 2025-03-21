
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetailsPage from "./pages/ProjectDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<Index />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/planning" element={<Index />} />
          <Route path="/team-work" element={<Index />} />
          <Route path="/my-work" element={<Index />} />
          <Route path="/templates" element={<Index />} />
          <Route path="/clients" element={<Index />} />
          <Route path="/contacts" element={<Index />} />
          <Route path="/notifications" element={<Index />} />
          <Route path="/account" element={<Index />} />
          <Route path="/help" element={<Index />} />
          <Route path="/logout" element={<Navigate to="/" replace />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
