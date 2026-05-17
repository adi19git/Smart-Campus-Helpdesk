import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Ticket, Clock, CheckCircle, AlertCircle, Search, Loader2, Home, Wifi, Zap, Droplets, Bus, BookOpen, Plus } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTickets, rateTicket, createTicket } from '../../api/tickets';
import StatsCard from '../ui/StatsCard';
import StatusBadge, { PriorityBadge } from '../ui/StatusBadge';
import StarRating from '../ui/StarRating';
import Modal from '../ui/Modal';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';

const CATEGORIES = [
  { value: 'hostel', label: 'Hostel', icon: Home, color: 'text-rose-500' },
  { value: 'network', label: 'Wi-Fi', icon: Wifi, color: 'text-blue-500' },
  { value: 'classroom', label: 'Classroom', icon: BookOpen, color: 'text-amber-500' },
  { value: 'electricity', label: 'Electricity', icon: Zap, color: 'text-yellow-500' },
  { value: 'cleanliness', label: 'Cleanliness', icon: Droplets, color: 'text-cyan-500' },
  { value: 'transport', label: 'Transport', icon: Bus, color: 'text-indigo-500' },
];

const StudentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ title: '', description: '', category: 'classroom', priority: 'low' });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ search, status: filterStatus });
      setTickets(data.results || data);
    } catch (err) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTickets(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterStatus]);

  const handleRating = async (id, rating) => {
    try {
      await rateTicket(id, rating);
      toast.success('Thank you for your feedback!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTicket(formData);
      toast.success('Ticket created successfully!');
      setShowModal(false);
      setFormData({ title: '', description: '', category: 'classroom', priority: 'low' });
      fetchTickets();
    } catch (err) {
      toast.error('Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  const statuses = [
    { label: 'All', value: '' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Closed', value: 'closed' },
  ];

  const getCategoryIcon = (cat) => {
    const found = CATEGORIES.find(c => c.value === cat);
    if (!found) return null;
    const CatIcon = found.icon;
    return <CatIcon className={`w-4 h-4 ${found.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Ticket} value={totalTickets} label="Total Tickets" color="indigo" delay={0} />
        <StatsCard icon={AlertCircle} value={openTickets} label="Open Issues" color="rose" delay={0.05} />
        <StatsCard icon={Clock} value={inProgressTickets} label="In Progress" color="amber" delay={0.1} />
        <StatsCard icon={CheckCircle} value={closedTickets} label="Resolved" color="emerald" delay={0.15} />
      </div>

      {/* Quick Categories */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-5 shadow-sm"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Raise by Category</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  setFormData(prev => ({ ...prev, category: cat.value }));
                  setShowModal(true);
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
              >
                <CatIcon className={`w-5 h-5 ${cat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-slate-800/50 p-2 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 px-2 pb-1 sm:pb-0 overflow-x-auto">
          <div className="w-px h-7 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1 flex-shrink-0" />
          {statuses.map(s => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                filterStatus === s.value
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap flex-shrink-0 ml-1 sm:hidden"
          >
            <Plus className="w-3.5 h-3.5" /> Raise
          </button>
        </div>
      </motion.div>

      {/* Tickets Grid */}
      <div>
        {loading ? (
          <LoadingSkeleton variant="card" count={6} />
        ) : tickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
            <EmptyState
              icon={Ticket}
              title="No Tickets Found"
              description="You haven't raised any tickets yet, or none match your current filters."
              action={() => setShowModal(true)}
              actionLabel="Raise Your First Ticket"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {tickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">#{ticket.id}</span>
                      {getCategoryIcon(ticket.category)}
                    </div>
                    <PriorityBadge priority={ticket.priority} size="xs" />
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {ticket.title}
                  </h4>

                  {/* Description */}
                  {ticket.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {ticket.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/30">
                    <StatusBadge status={ticket.status} size="xs" />
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {ticket.created_at ? format(new Date(ticket.created_at), 'MMM d, yyyy') : ''}
                    </span>
                  </div>

                  {/* Rating for closed tickets */}
                  {ticket.status === 'closed' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/30 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Your Rating</span>
                      <StarRating
                        rating={ticket.rating}
                        onRate={(r) => handleRating(ticket.id, r)}
                        readonly={!!ticket.rating}
                        size="sm"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Raise Ticket Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Raise New Ticket"
        subtitle="Submit a new support request to the campus helpdesk"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed explanation of the issue..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentDashboard;