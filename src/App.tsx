import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from '@/pages/Index';
import Projects from '@/pages/Projects';
import ProjectDetailsPage from '@/pages/ProjectDetails';
import Templates from '@/pages/Templates';
import NewTemplate from '@/pages/NewTemplate';
import TemplateDetails from '@/pages/TemplateDetails';
import Clients from '@/pages/Clients';
import NotFound from '@/pages/NotFound';
import ClientDetails from './pages/ClientDetails';

// Routes definition
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/projects/:projectId',
    element: <ProjectDetailsPage />,
  },
  {
    path: '/templates',
    element: <Templates />,
  },
  {
    path: '/templates/new',
    element: <NewTemplate />,
  },
  {
    path: '/templates/:templateId',
    element: <TemplateDetails />,
  },
  {
    path: '/clients',
    element: <Clients />,
  },
  {
    path: '/clients/:clientId',
    element: <ClientDetails />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
