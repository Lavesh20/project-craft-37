
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { mockData } from '@/services/mock';
import { useAuth } from '@/context/AuthContext';

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, to, badge, isActive, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 text-white transition-all duration-200 hover:bg-opacity-10 hover:bg-white w-full text-left ${
          isActive ? 'sidebar-active' : ''
        }`}
      >
        <Icon size={20} className="flex-shrink-0" />
        <span className="flex-grow">{label}</span>
        {badge && (
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${
            typeof badge === 'number' && badge > 0 ? 'bg-red-500' : 'bg-orange-500'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  }

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
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${
          typeof badge === 'number' && badge > 0 ? 'bg-red-500' : 'bg-orange-500'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  
  // Calculate notifications count based on overdue tasks
  const calculateNotificationsCount = () => {
    const today = new Date();
    
    // Count upcoming/overdue tasks
    const taskNotifications = mockData.tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      // Get tasks due within 3 days or overdue
      return timeDiff <= 3 * 24 * 60 * 60 * 1000;
    }).length;
    
    // Count upcoming project deadlines
    const projectNotifications = mockData.projects.filter(project => {
      const deadline = new Date(project.dueDate);
      const timeDiff = deadline.getTime() - today.getTime();
      // Get projects due within 5 days or overdue
      return timeDiff <= 5 * 24 * 60 * 60 * 1000;
    }).length;
    
    // Add 2 for system notifications (trial ending, new feature)
    return taskNotifications + projectNotifications + 2;
  };
  
  const notificationsCount = calculateNotificationsCount();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

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
            label="Dashboard" 
            to="/dashboard" 
            isActive={currentPath === '/dashboard'} 
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
            badge={notificationsCount} 
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
            to="#" 
            onClick={handleLogout}
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
