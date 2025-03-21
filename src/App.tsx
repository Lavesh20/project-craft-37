
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetailsPage from "./pages/ProjectDetails";
import TemplatesPage from "./pages/Templates";
import TemplateDetailsPage from "./pages/TemplateDetails";
import NewTemplatePage from "./pages/NewTemplate";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Clients from "./pages/Clients";

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
          <Route path="/projects" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/projects/:projectId" element={<MainLayout><ProjectDetailsPage /></MainLayout>} />
          <Route path="/planning" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/team-work" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/my-work" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/templates" element={<MainLayout><TemplatesPage /></MainLayout>} />
          <Route path="/templates/new" element={<MainLayout><NewTemplatePage /></MainLayout>} />
          <Route path="/templates/:templateId" element={<MainLayout><TemplateDetailsPage /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
          <Route path="/contacts" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/notifications" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/account" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/help" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/logout" element={<Navigate to="/" replace />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
