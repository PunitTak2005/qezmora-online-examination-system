import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './common/Logo';
import { getAvatarUrl } from '../utils/avatarUrl';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = location.pathname.includes('/student') || 
                      location.pathname.includes('/teacher') || 
                      location.pathname.includes('/admin');

  const isAuthenticated = localStorage.getItem('token') !== null;
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: `/${user?.role || 'student'}/dashboard`, icon: LayoutDashboard },
    { name: 'Profile Settings', path: `/${user?.role || 'student'}/profile`, icon: Settings },
  ];

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Exams', path: '/exams' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={clsx(
      "sticky top-0 w-full z-40 transition-all duration-300",
      isScrolled 
        ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800"
        : "bg-white dark:bg-gray-950 border-b border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group outline-none shrink-0 mr-8">
              <Logo variant="horizontal" className="h-8 w-auto hidden dark:hidden sm:block" />
              <Logo variant="inverted" className="h-8 w-auto hidden dark:sm:block" />
              <Logo variant="light" className="h-8 w-8 sm:hidden" />
            </Link>
            
            <div className="hidden md:block border-l border-gray-200 dark:border-gray-800 h-8 mr-8"></div>
            
            {!isDashboard && (
              <ul className="hidden md:flex items-center gap-8 m-0 p-0 list-none">
                {publicLinks.map((link, idx) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={idx}>
                      <Link 
                        to={link.path}
                        onClick={(e) => {
                          if (isActive && link.path === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={clsx(
                          "flex items-center gap-2 font-bold px-3 py-2 transition-all",
                          isActive 
                            ? "text-primary border-b-2 border-gold pb-1" 
                            : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary pb-1"
                        )}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-cream dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none bg-cream dark:bg-gray-800 p-1.5 pr-4 rounded-full border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all"
                >
                  {user?.avatar ? (
                    <img 
                      src={getAvatarUrl(user.avatar)} 
                      alt={user.name} 
                      className="w-9 h-9 rounded-full object-cover border border-primary/20 shadow-inner"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-inner">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user?.name}
                  </div>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 mb-2">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to={`/${user.role}/dashboard`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700/50 hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link 
                        to={`/${user.role}/profile`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-700/50 hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Profile Settings
                      </Link>
                      <div className="border-t border-gray-50 dark:border-gray-700/50 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn btn-outline px-5 py-2.5 text-sm border-none shadow-none hover:bg-cream dark:hover:bg-gray-800">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary px-5 py-2.5 text-sm shadow-sm shadow-primary/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
              
              {!isDashboard && (
                <ul className="list-none m-0 p-0 space-y-2">
                  {publicLinks.map((link, idx) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={idx}>
                        <Link 
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors",
                            isActive 
                              ? "bg-primary/10 text-primary border-l-4 border-primary" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-800"
                          )}
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {isAuthenticated ? (
                <>
                  <div className="py-4 mb-2 flex items-center gap-3 border-y border-gray-50 dark:border-gray-800 mt-4">
                    {user?.avatar ? (
                      <img 
                        src={getAvatarUrl(user.avatar)} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-primary/20 shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-xs font-bold text-primary uppercase tracking-wide">{user.role}</div>
                    </div>
                  </div>
                  
                  {isDashboard && (
                    <Link 
                      to={`/${user.role}/profile`} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-cream dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-400" /> Profile Settings
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-danger hover:bg-danger/10 transition-colors mt-2"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline w-full"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary w-full"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
