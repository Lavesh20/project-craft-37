
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from './pages/Index';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import TeamWork from './pages/TeamWork';
import MyWork from './pages/MyWork';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Contacts from './pages/Contacts';
import ContactDetails from './pages/ContactDetails';
import Templates from './pages/Templates';
import TemplateDetails from './pages/TemplateDetails';
import NewTemplate from './pages/NewTemplate';
import Account from './pages/Account';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import { NotificationProvider } from './context/NotificationContext';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planning" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/team-work" element={<TeamWork />} />
            <Route path="/my-work" element={<MyWork />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetails />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:id" element={<TemplateDetails />} />
            <Route path="/templates/new" element={<NewTemplate />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-center" />
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
