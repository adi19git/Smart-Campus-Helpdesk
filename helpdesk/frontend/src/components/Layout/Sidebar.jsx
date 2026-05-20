import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, Sun, Moon, ChevronLeft, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
  ];

  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? 'items-center' : ''}`}>
      {/* Logo */}
      <div className={`p-5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-2`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight block">SmartHelp</span>
              <span className="text-[10px] font-medium text-blue-500 dark:text-blue-400">Campus Helpdesk</span>
            </div>
          )}
        </div>
        {/* Collapse button - desktop only */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {/* Close button - mobile only */}
        {!collapsed && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mb-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      )}

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${collapsed ? 'px-3' : 'px-4'} py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-sm border border-blue-100 dark:border-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{link.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`${collapsed ? 'px-2' : 'px-3'} pb-4 space-y-2`}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 w-full ${collapsed ? 'px-3' : 'px-4'} py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-white transition-all text-sm`}
        >
          {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User Card */}
        {!collapsed && (
          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user?.isStaff ? 'Administrator' : 'Student'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 w-full ${collapsed ? 'px-3' : 'px-4'} py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all text-sm`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col ${collapsed ? 'w-[72px]' : 'w-64'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed top-0 left-0 transition-all duration-300 z-30`}>
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
