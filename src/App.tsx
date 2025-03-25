
import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  isRouteErrorResponse
} from "react-router-dom";
import Index from '@/pages/Index';
import Projects from '@/pages/Projects';
import ProjectDetailsPage from '@/pages/ProjectDetails';
import Templates from '@/pages/Templates';
import NewTemplate from '@/pages/NewTemplate';
import TemplateDetails from '@/pages/TemplateDetails';
import Clients from '@/pages/Clients';
import Contacts from '@/pages/Contacts';
import ContactDetails from '@/pages/ContactDetails';
import NotFound from '@/pages/NotFound';
import ClientDetails from '@/pages/ClientDetails';
import MyWork from '@/pages/MyWork';
import TeamWork from '@/pages/TeamWork';

// Error boundary as a class component
class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but an error occurred while rendering this page.
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
              <pre className="text-sm text-gray-800">{this.state.error?.toString()}</pre>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route error component using React Router's error handling
function RouteErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred";
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || "Unknown error";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          We're sorry, but an error occurred while rendering this page.
        </p>
        <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto">
          <pre className="text-sm text-gray-800">{errorMessage}</pre>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

// Routes definition with error boundaries
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/projects',
    element: <Projects />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/projects/:projectId',
    element: <ProjectDetailsPage />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/templates',
    element: <Templates />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/templates/new',
    element: <NewTemplate />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/templates/:templateId',
    element: <TemplateDetails />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/clients',
    element: <Clients />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/clients/:clientId',
    element: <ClientDetails />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/contacts',
    element: <Contacts />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/contacts/:contactId',
    element: <ContactDetails />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/my-work',
    element: <MyWork />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '/team-work',
    element: <TeamWork />,
    errorElement: <RouteErrorBoundary />
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <RouteErrorBoundary />
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
