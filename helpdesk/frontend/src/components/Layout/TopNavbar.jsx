import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Plus, CheckCircle, Clock, AlertCircle, Star, Check, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../../api/tickets';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const TopNavbar = ({ title, subtitle, onMenuToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch tickets and compute dynamic notifications
  const checkNotifications = async () => {
    if (!user) return;
    try {
      const tickets = await getTickets();
      const ticketList = tickets.results || tickets;

      const cacheKey = `seen_states_${user.id}`;
      const notifKey = `notifications_${user.id}`;

      // Load previous state
      const rawSeen = localStorage.getItem(cacheKey);
      const rawNotifs = localStorage.getItem(notifKey);

      let seenStates = rawSeen ? JSON.parse(rawSeen) : {};
      let currentNotifs = rawNotifs ? JSON.parse(rawNotifs) : [];

      const newSeenStates = {};
      const newNotifs = [];

      // If it's the very first load, initialize seenStates and add a welcome notification
      const isFirstLoad = Object.keys(seenStates).length === 0;

      ticketList.forEach(ticket => {
        const prev = seenStates[ticket.id];
        newSeenStates[ticket.id] = {
          status: ticket.status,
          rating: ticket.rating,
          title: ticket.title
        };

        if (isFirstLoad) return; // Skip generating change notifications on first load

        if (!prev) {
          // New ticket created
          if (user.isStaff) {
            newNotifs.push({
              id: `new_${ticket.id}_${Date.now()}`,
              title: 'New Complaint Raised',
              description: `"${ticket.title}" was submitted by ${ticket.user}`,
              time: new Date().toISOString(),
              type: 'info',
              unread: true
            });
          } else {
            newNotifs.push({
              id: `new_${ticket.id}_${Date.now()}`,
              title: 'Ticket Submitted',
              description: `Your ticket #${ticket.id} is now registered`,
              time: new Date().toISOString(),
              type: 'info',
              unread: true
            });
          }
        } else {
          // Status updated
          if (prev.status !== ticket.status) {
            if (user.isStaff) {
              newNotifs.push({
                id: `status_${ticket.id}_${Date.now()}`,
                title: 'Ticket Status Updated',
                description: `Ticket #${ticket.id} changed to "${ticket.status}"`,
                time: new Date().toISOString(),
                type: 'status',
                status: ticket.status,
                unread: true
              });
            } else {
              newNotifs.push({
                id: `status_${ticket.id}_${Date.now()}`,
                title: 'Your Ticket Updated',
                description: `"${ticket.title}" is now "${ticket.status}"`,
                time: new Date().toISOString(),
                type: 'status',
                status: ticket.status,
                unread: true
              });
            }
          }

          // Rated (for admin notification)
          if (ticket.rating && prev.rating !== ticket.rating && user.isStaff) {
            newNotifs.push({
              id: `rating_${ticket.id}_${Date.now()}`,
              title: 'Review Submitted',
              description: `Ticket #${ticket.id} was rated ${ticket.rating}/5 stars`,
              time: new Date().toISOString(),
              type: 'rating',
              rating: ticket.rating,
              unread: true
            });
          }
        }
      });

      // Initialize welcome notification on first run
      if (isFirstLoad && currentNotifs.length === 0) {
        currentNotifs.push({
          id: 'welcome',
          title: 'Welcome to Smart Campus Helpdesk!',
          description: user.isStaff 
            ? 'Track, assign, and resolve student complaints in real-time.' 
            : 'Select a category to raise your first support ticket.',
          time: new Date().toISOString(),
          type: 'welcome',
          unread: true
        });
      }

      // Merge new notifications into the front of the list
      if (newNotifs.length > 0) {
        currentNotifs = [...newNotifs, ...currentNotifs];
      }

      // Update state & localStorage
      localStorage.setItem(cacheKey, JSON.stringify(newSeenStates));
      localStorage.setItem(notifKey, JSON.stringify(currentNotifs));
      setNotifications(currentNotifs);
    } catch (err) {
      console.error('Failed to update notifications', err);
    }
  };

  // Run checks on mount and every 15 seconds
  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markAllAsRead = () => {
    const notifKey = `notifications_${user?.id}`;
    const updated = notifications.map(n => ({ ...n, unread: false }));
    localStorage.setItem(notifKey, JSON.stringify(updated));
    setNotifications(updated);
  };

  const markAsRead = (id) => {
    const notifKey = `notifications_${user?.id}`;
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    localStorage.setItem(notifKey, JSON.stringify(updated));
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotifIcon = (notif) => {
    if (notif.type === 'welcome') return <HelpCircle className="w-4 h-4 text-blue-500" />;
    if (notif.type === 'rating') return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
    if (notif.type === 'status') {
      if (notif.status === 'closed') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      if (notif.status === 'in-progress') return <Clock className="w-4 h-4 text-blue-500" />;
      return <AlertCircle className="w-4 h-4 text-indigo-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-indigo-500" />;
  };

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

          {/* Notifications Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Notifications"
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors active:scale-95"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-blue-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1 border border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl overflow-hidden z-50 flex flex-col max-h-[480px]"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/80">
                    <span className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="overflow-y-auto custom-scrollbar flex-1 max-h-[350px] divide-y divide-slate-100 dark:divide-slate-700/30">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-medium">All caught up!</p>
                        <p className="text-xs mt-0.5">No notifications yet.</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all ${
                            notif.unread ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notif.unread 
                              ? 'bg-blue-100/60 dark:bg-blue-950/40' 
                              : 'bg-slate-100 dark:bg-slate-700/50'
                          }`}>
                            {getNotifIcon(notif)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <p className={`text-xs font-bold truncate ${
                                notif.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-400'
                              }`}>
                                {notif.title}
                              </p>
                              {notif.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                              {notif.description}
                            </p>
                            <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1 block">
                              {formatDistanceToNow(new Date(notif.time), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
