
import React from 'react';
import Sidebar from './Sidebar';
import TrialBanner from './TrialBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <TrialBanner />
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
