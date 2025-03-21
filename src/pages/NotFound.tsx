
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from '@/components/layout/MainLayout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-6 text-jetpack-blue">404</h1>
          <p className="text-2xl font-medium text-gray-700 mb-6">
            Page not found
          </p>
          <p className="text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Button
            className="bg-jetpack-blue hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Go back
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
