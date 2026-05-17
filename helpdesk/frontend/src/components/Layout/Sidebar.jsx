import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <Ticket className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">SmartHelp</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <div className="text-sm text-slate-400">Logged in as</div>
          <div className="font-medium text-white truncate">{user?.username}</div>
          {user?.isStaff && (
            <span className="inline-block mt-1 text-xs px-2 py-1 bg-primary-900/50 text-primary-300 rounded-md">
              Administrator
            </span>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
