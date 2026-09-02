import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Tooltip from './ui/Tooltip';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  User, 
  Users, 
  FileText, 
  X,
  FolderTree,
  Trophy,
  Mail,
  ShieldAlert
} from 'lucide-react';
import clsx from 'clsx';

const navItems = {
  student: [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Exams', path: '/student/exams', icon: BookOpen },
    { name: 'History', path: '/student/history', icon: History },
    { name: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/student/profile', icon: User },
  ],
  teacher: [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'My Exams', path: '/teacher/exams', icon: FileText },
    { name: 'Profile Settings', path: '/teacher/profile', icon: User },
  ],
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Exams', path: '/admin/exams', icon: FileText },
    { name: 'Exam Integrity', path: '/admin/integrity', icon: ShieldAlert },
    { name: 'Messages', path: '/admin/contact-messages', icon: Mail },
    { name: 'Profile Settings', path: '/admin/profile', icon: User },
  ]
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const links = navItems[user.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out flex flex-col",
        !isOpen && "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-100 dark:border-gray-800 shrink-0 relative z-10">
          <Link to={`/${user?.role}/dashboard`} className="flex items-center gap-2 group outline-none">
            <img src="/logo/qezmora-logo-horizontal.png" alt="Qezmora" className="h-7 hidden dark:hidden sm:block" />
            <img src="/logo/qezmora-logo-inverted.png" alt="Qezmora" className="h-7 hidden dark:sm:block" />
            <img src="/logo/qezmora-icon-light.png" alt="Qezmora Icon" className="h-6 w-6 sm:hidden" />
          </Link>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => (
            <Tooltip key={link.path} title={link.name} content={`Navigate to ${link.name}`} position="right" className="w-full">
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            </Tooltip>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
