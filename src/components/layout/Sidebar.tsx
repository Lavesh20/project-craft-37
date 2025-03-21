
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Briefcase, 
  Copy, 
  Building2, 
  Book, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, to, badge, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 text-white transition-all duration-200 hover:bg-opacity-10 hover:bg-white ${
        isActive ? 'sidebar-active' : ''
      }`}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="flex-grow">{label}</span>
      {badge && (
        <span className="px-2 py-1 text-xs font-medium bg-orange-500 rounded-md">
          {badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-jetpack-blue w-64 h-screen flex flex-col overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl font-bold">jetpack</span>
          <span className="text-white text-lg">=</span>
          <span className="text-white text-lg font-light">workflow</span>
        </div>
      </div>

      <div className="flex-grow">
        <nav className="space-y-1">
          <SidebarLink 
            icon={LayoutDashboard} 
            label="Planning" 
            to="/planning" 
            badge="Beta" 
            isActive={currentPath === '/planning'} 
          />
          <SidebarLink 
            icon={Users} 
            label="Team Work" 
            to="/team-work" 
            isActive={currentPath === '/team-work'} 
          />
          <SidebarLink 
            icon={User} 
            label="My Work" 
            to="/my-work" 
            isActive={currentPath === '/my-work'} 
          />
          <SidebarLink 
            icon={Briefcase} 
            label="Projects" 
            to="/projects" 
            isActive={currentPath === '/projects'} 
          />
          <SidebarLink 
            icon={Copy} 
            label="Templates" 
            to="/templates" 
            isActive={currentPath === '/templates'} 
          />
          <SidebarLink 
            icon={Building2} 
            label="Clients" 
            to="/clients" 
            isActive={currentPath === '/clients'} 
          />
          <SidebarLink 
            icon={Book} 
            label="Contacts" 
            to="/contacts" 
            isActive={currentPath === '/contacts'} 
          />
        </nav>
      </div>

      <div className="mt-auto border-t border-white border-opacity-20">
        <nav className="space-y-1 py-2">
          <SidebarLink 
            icon={Bell} 
            label="Notifications" 
            to="/notifications" 
            isActive={currentPath === '/notifications'} 
          />
          <SidebarLink 
            icon={Settings} 
            label="Account" 
            to="/account" 
            isActive={currentPath === '/account'} 
          />
          <SidebarLink 
            icon={HelpCircle} 
            label="Help & Support" 
            to="/help" 
            isActive={currentPath === '/help'} 
          />
          <SidebarLink 
            icon={LogOut} 
            label="Sign Out" 
            to="/logout" 
            isActive={currentPath === '/logout'} 
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
