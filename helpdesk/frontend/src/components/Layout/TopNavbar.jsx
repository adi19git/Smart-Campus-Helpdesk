import React from 'react';
import { Search, Bell, Menu, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopNavbar = ({ title, subtitle, onMenuToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 gap-3 h-16">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuToggle}
            aria-label="Open sidebar"
            className="lg:hidden flex-shrink-0 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate leading-tight">{title}</h1>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate leading-tight">{subtitle}</p>}
          </div>
        </div>

        {/* Center: Search (hidden on small screens) */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {!user?.isStaff && (
            <button
              onClick={() => navigate('/tickets/new')}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 sm:px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">New Ticket</span>
            </button>
          )}

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors active:scale-95"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Avatar + Name */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 ml-0.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-900 dark:text-white leading-none truncate max-w-[90px] lg:max-w-none">{user?.username}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.isStaff ? 'Admin' : 'Student'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
