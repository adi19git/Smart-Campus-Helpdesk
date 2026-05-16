import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Loader2, User, Plus, AlertCircle, CheckCircle2, Star, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTickets, rateTicket } from '../../api/tickets';

const StudentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ search, category, status });
      setTickets(data.results || data);
    } catch (err) {
      toast.error('Failed to fetch your tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (id, ratingValue) => {
    try {
      await rateTicket(id, ratingValue);
      toast.success('Rating submitted successfully!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, status]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      case 'medium': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default: return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'closed': return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/20';
      case 'in-progress': return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
      default: return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20';
    }
  };

  // Metrics
  const activeTickets = tickets.filter(t => t.status !== 'closed').length;
  const resolvedTickets = tickets.filter(t => t.status === 'closed').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 rounded-xl">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            My Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Track and manage your personal support requests.</p>
        </div>
        <Link
          to="/tickets/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Ticket
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up-delay-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>
          <div className="p-4 bg-amber-50 rounded-2xl ring-1 ring-amber-100 relative z-10">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Active Requests</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{activeTickets}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>
          <div className="p-4 bg-emerald-50 rounded-2xl ring-1 ring-emerald-100 relative z-10">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Resolved</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{resolvedTickets}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row gap-2 animate-fade-in-up-delay-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search my tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
        </div>
        <div className="flex items-center gap-2 px-2 sm:px-0 pb-2 sm:pb-0">
          <div className="w-px h-8 bg-slate-200 hidden sm:block mx-2"></div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-700 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="classroom">Classroom</option>
            <option value="hostel">Hostel</option>
            <option value="network">Network</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up-delay-3">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-72">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Loading your history...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-24 px-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-blue-100">
              <Ticket className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">No tickets yet</h3>
            <p className="text-slate-500 mt-1 text-sm font-medium mb-6">You haven't submitted any support requests.</p>
            <Link
              to="/tickets/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors ring-1 ring-inset ring-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Create your first ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">#{ticket.id}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ticket.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 max-w-sm truncate" title={ticket.description}>
                            {ticket.description}
                          </div>
                          <div className="text-xs font-semibold text-slate-500 mt-1 capitalize">{ticket.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                      {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-5">
                      {ticket.status === 'closed' ? (
                        <div className="flex justify-center gap-1.5 p-1.5 bg-slate-50/80 rounded-full w-max mx-auto ring-1 ring-slate-100 shadow-inner">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              whileHover={{ scale: 1.25, y: -4, rotate: [0, -15, 15, -10, 10, 0] }}
                              whileTap={{ scale: 0.8, rotate: -20 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              onClick={() => handleRating(ticket.id, star)}
                              className={`p-1 rounded-full ${ticket.rating >= star
                                  ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                                  : 'text-slate-300 hover:text-yellow-300'
                                }`}
                              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                              <Star className={`w-5 h-5 transition-colors duration-300 ${ticket.rating >= star ? 'fill-current' : 'fill-transparent stroke-[1.5px]'}`} />
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-xs font-medium text-slate-400 px-2.5 py-1 bg-slate-50 rounded-md border border-slate-100">
                            Awaiting Resolution
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
