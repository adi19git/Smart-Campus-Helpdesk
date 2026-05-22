import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Trash2, Ticket, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { getTickets, deleteTicket, updateTicketStatus } from '../../api/tickets';
import StatsCard from '../ui/StatsCard';
import { PriorityBadge } from '../ui/StatusBadge';
import StarRating from '../ui/StarRating';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';


const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ search, category, status });
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
  }, [search, category, status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await deleteTicket(id);
      toast.success('Ticket deleted');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTicketStatus(id, newStatus);
      toast.success('Status updated');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Computed stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  // Chart data
  const categoryData = useMemo(() => {
    const counts = {};
    tickets.forEach(t => {
      const cat = t.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      tickets: value,
    }));
  }, [tickets]);

  const statusData = useMemo(() => [
    { name: 'Open', value: openTickets, color: '#6366f1' },
    { name: 'In Progress', value: inProgressTickets, color: '#3b82f6' },
    { name: 'Closed', value: closedTickets, color: '#10b981' },
  ], [openTickets, inProgressTickets, closedTickets]);

  const trendData = useMemo(() => {
    const days = {};
    tickets.forEach(t => {
      if (!t.created_at) return;
      const day = format(new Date(t.created_at), 'MMM d');
      days[day] = (days[day] || 0) + 1;
    });
    return Object.entries(days).slice(-7).map(([date, count]) => ({ date, tickets: count }));
  }, [tickets]);

  const getStatusClasses = (s) => {
    switch (s) {
      case 'closed': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20';
      case 'in-progress': return 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20';
      default: return 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Ticket}       value={totalTickets}     label="Total Complaints" color="violet" delay={0}    />
        <StatsCard icon={AlertCircle}  value={openTickets}      label="Pending"          color="pink"   delay={0.05} />
        <StatsCard icon={Clock}        value={inProgressTickets}label="In Progress"      color="orange" delay={0.1}  />
        <StatsCard icon={CheckCircle}  value={closedTickets}    label="Resolved"         color="green"  delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart - Department wise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-5 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tickets by category</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, #e2e8f0)" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="tickets" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart - Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-5 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Status Breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Current ticket states</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-5 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Ticket Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Recent ticket volume</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={2} fill="url(#colorTickets)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-slate-800/50 p-2 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-2 pb-1 sm:pb-0 flex-wrap sm:flex-nowrap">
          <div className="w-px h-7 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All Categories</option>
            <option value="classroom">Classroom</option>
            <option value="hostel">Hostel</option>
            <option value="network">Network</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <LoadingSkeleton variant="table" count={5} />
        ) : tickets.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="Inbox Zero!"
            description="There are no tickets matching your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-700/30 border-b border-slate-200/80 dark:border-slate-700/50">
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ticket</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="hidden md:table-cell px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="hidden lg:table-cell px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Rating</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-all group">
                    <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md dark:text-slate-500">#{ticket.id}</div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[200px]">{ticket.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{ticket.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {ticket.user?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{ticket.user}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <PriorityBadge priority={ticket.priority} size="xs" />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase tracking-wide rounded-md px-2 py-1 cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ring-1 ring-inset ${getStatusClasses(ticket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="hidden lg:table-cell px-5 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      {ticket.created_at ? format(new Date(ticket.created_at), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="hidden lg:table-cell px-5 py-4 text-center cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex flex-col items-center justify-center">
                        <StarRating rating={ticket.rating} readonly size="sm" />
                        {ticket.review && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic max-w-[120px] truncate mt-0.5 font-medium" title={ticket.review}>
                            "{ticket.review}"
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all p-2 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Details — #${selectedTicket.id}`}
          subtitle={selectedTicket.created_at ? `Raised by ${selectedTicket.user} on ${format(new Date(selectedTicket.created_at), 'PPP')}` : ''}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6">
            {/* Header info / badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                  Category: {selectedTicket.category}
                </span>
              </div>
              <PriorityBadge priority={selectedTicket.priority} />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {selectedTicket.title}
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/30 text-sm text-slate-750 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                {selectedTicket.description}
              </div>
            </div>

            {/* Manage Section */}
            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-3 bg-white dark:bg-slate-800/20">
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Manage Ticket
              </label>
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    handleStatusChange(selectedTicket.id, e.target.value);
                    setSelectedTicket(prev => ({ ...prev, status: e.target.value }));
                  }}
                  className={`text-xs font-bold uppercase tracking-wide rounded-xl px-3 py-2 cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ring-1 ring-inset ${getStatusClasses(selectedTicket.status)}`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={() => {
                    handleDelete(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Ticket
                </button>
              </div>
            </div>

            {/* Review Section */}
            {selectedTicket.status === 'closed' && (
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/50 space-y-3">
                <h5 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Student Feedback
                </h5>
                {selectedTicket.rating ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={selectedTicket.rating} readonly size="sm" />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        ({selectedTicket.rating}.0 out of 5)
                      </span>
                    </div>
                    {selectedTicket.review ? (
                      <div className="p-4 bg-amber-50/30 dark:bg-amber-500/5 rounded-2xl border border-amber-200/40 dark:border-amber-500/20 text-sm text-slate-700 dark:text-slate-350 leading-relaxed italic">
                        "{selectedTicket.review}"
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                        No written review comment was provided.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    This ticket has been resolved but hasn't been reviewed by the student yet.
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-center"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
