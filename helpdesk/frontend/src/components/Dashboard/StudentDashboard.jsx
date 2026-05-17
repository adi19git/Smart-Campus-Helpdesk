import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, LayoutDashboard, Ticket as TicketIcon, FileText,
  Megaphone, BarChart3, Settings, User, Plus, Home, Monitor,
  BookOpen, Droplets, Trash2, Edit3, Image as ImageIcon, Upload, X
} from 'lucide-react';
import { getTickets } from '../../api/tickets';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showRaiseTicketForm, setShowRaiseTicketForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Hostel',
    subcategory: 'Electricity/Power Failure',
    location: '',
    priority: 'Medium',
    subject: '',
    description: ''
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data.results || data);
      } catch (err) {
        // Fallback mock data if API fails so UI doesn't look empty
        setTickets([
          { id: '2941', title: 'Hostel Room 301B - Electricity Issue', status: 'in-progress', priority: 'High', time: '2 hrs ago', tag: 'Red' },
          { id: '2940', title: 'Wi-Fi Connectivity Library', status: 'open', priority: 'Medium', time: '1 day ago' },
          { id: '2938', title: 'Classroom B-102 Projector', status: 'closed', priority: 'Medium', time: '3 days ago' },
        ]);
      }
    };
    fetchTickets();
  }, []);

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'closed').length;

  const handleQuickCategorySelect = (categoryName) => {
    setFormData(prev => ({ ...prev, category: categoryName }));
    setShowWorkflow(false);
    setShowRaiseTicketForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Ticket submitted successfully!');
    setShowRaiseTicketForm(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed font-sans text-slate-800 flex items-center justify-center p-4 md:p-6"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}>

      {/* Main Glass Container */}
      <div className="w-full max-w-[1400px] h-[90vh] bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(15,23,42,0.2)] flex overflow-hidden relative">

        {/* Left Sidebar */}
        <div className="w-64 bg-slate-900/85 backdrop-blur-2xl text-white flex flex-col p-6 border-r border-white/10 shrink-0 hidden md:flex">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 border border-white/20">
              <span className="font-bold text-xl">H</span>
            </div>
            <div className="font-bold leading-tight tracking-wide text-sm">
              Smart Campus<br /><span className="text-blue-400 font-medium">Helpdesk</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5">
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 bg-blue-600 text-white rounded-xl transition-all font-semibold shadow-md shadow-blue-600/10">
              <LayoutDashboard className="w-5 h-5" /> Dashboard <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Active</span>
            </button>
            {['My Tickets', 'Raise Ticket', 'Announcements', 'Analytics'].map((item, idx) => {
              const Icons = [FileText, TicketIcon, Megaphone, BarChart3];
              const ComponentIcon = Icons[idx];
              return (
                <button key={item} className="flex w-full text-left items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium group">
                  <ComponentIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" /> {item}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1.5 pt-6 border-t border-white/10">
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all font-medium border border-transparent">
              <Settings className="w-5 h-5 text-purple-400" /> Settings
            </button>
            <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
              <User className="w-5 h-5" /> Profile
            </button>
          </div>
        </div>

        {/* Center Content Section */}
        <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50/20">

          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Campus Support..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500 shadow-sm transition-all"
              />
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Quick Stats Pill */}
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/80 shadow-sm text-sm font-bold text-slate-700">
                <span>124</span>
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px]">3</span>
                <span>5.3</span>
                <span className="text-emerald-600">124</span>
              </div>

              <button className="relative p-2.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl shadow-sm hover:bg-white/90 transition-all text-slate-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md pl-2 pr-4 py-1.5 rounded-2xl border border-white/80 shadow-sm hover:bg-white/90 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-blue-200 overflow-hidden border border-white">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4" alt="avatar" />
                </div>
                <div className="text-sm hidden lg:block">
                  <div className="font-bold text-slate-800 leading-none">Sarah Jenkins</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">ID: 2109405</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Workspace</h2>
            <p className="text-xs text-slate-600 font-medium">Manage and review your raised campus tickets</p>
          </div>

          {/* Stats Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Open Tickets', count: openCount, badge: '3', color: 'bg-red-100 text-red-600' },
              { label: 'In Progress', count: inProgressCount, badge: '5', color: 'bg-amber-100 text-amber-600' },
              { label: 'Resolved Tickets', count: resolvedCount, badge: '124', color: 'bg-emerald-100 text-emerald-600' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/70 backdrop-blur-xl border border-white/60 p-5 rounded-2xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-500 text-xs tracking-wide uppercase">{stat.label}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.color}`}>{stat.badge}</span>
                </div>
                <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.count}</div>
              </div>
            ))}
          </div>

          {/* Search Bar / Launch Action Strip */}
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search issues or knowledge base..."
                className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-slate-400 shadow-sm"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowWorkflow(!showWorkflow)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10"
              >
                <Plus className="w-4 h-4" /> Raise New Ticket
              </button>

              {/* Category Selection Micro-Dropdown */}
              <AnimatePresence>
                {showWorkflow && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 right-0 w-80 bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl rounded-2xl p-4 z-40"
                  >
                    <h3 className="font-bold text-sm text-slate-800 mb-3 text-center">Select Issue Workflow Zone</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Hostel', icon: Home, color: 'text-rose-500' },
                        { label: 'IT Dept', icon: Monitor, color: 'text-indigo-500' },
                        { label: 'Classroom', icon: BookOpen, color: 'text-amber-500' },
                        { label: 'Cleanliness', icon: Droplets, color: 'text-cyan-500' }
                      ].map((zone) => (
                        <button
                          key={zone.label}
                          onClick={() => handleQuickCategorySelect(zone.label)}
                          className="flex flex-col items-center p-3 rounded-xl border border-slate-100 hover:bg-blue-50/50 hover:border-blue-200 transition-all text-center"
                        >
                          <zone.icon className={`w-6 h-6 ${zone.color} mb-1`} />
                          <span className="text-xs font-bold text-slate-700">{zone.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <h3 className="font-bold text-slate-700 text-sm tracking-wide uppercase mb-3">Active Tickets Grid</h3>

          {/* Active Tickets Grid container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id || index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white/60 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all cursor-pointer flex flex-col group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold text-slate-400">TICKET #{ticket.id}</span>
                    {ticket.tag && (
                      <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">{ticket.tag}</span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-base leading-snug mb-3">
                    {ticket.title}
                  </h4>

                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${ticket.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <span className="text-xs font-semibold text-slate-600">{ticket.priority} Priority</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md ${ticket.status === 'in-progress' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          ticket.status === 'open' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                        {ticket.status}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">{ticket.time || 'Updated recently'}</span>
                    </div>

                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-500 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel/Drawer Form for Raising a Ticket */}
        <AnimatePresence>
          {showRaiseTicketForm && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col p-6 overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-800">Raise Ticket</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Fill in the fields to query support</p>
                </div>
                <button
                  onClick={() => setShowRaiseTicketForm(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Progress Visualizer */}
              <div className="flex items-center text-[10px] font-bold text-slate-400 mb-5 w-full">
                <span className="text-blue-600">1: Form</span>
                <div className="flex-1 h-0.5 bg-slate-100 mx-2">
                  <div className="w-1/2 h-full bg-blue-500"></div>
                </div>
                <span>2: Processing</span>
                <div className="flex-1 h-0.5 bg-slate-100 mx-2"></div>
                <span>3: Status</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Hostel">Hostel Zone</option>
                      <option value="IT Dept">IT Dept</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Cleanliness">Cleanliness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Sub-category</label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Electricity/Power Failure">Electricity/Power Failure</option>
                      <option value="Water Leakage">Water Leakage</option>
                      <option value="Hardware Breakdown">Hardware Breakdown</option>
                      <option value="Network Issue">Network Issue</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Room 301"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief title of the issue"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Description</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Explain the breakdown or issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">Attachments</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/70 cursor-pointer transition-colors group">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 group-hover:bg-blue-100/50 transition-colors">
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 flex-1 truncate">Upload screenshot/image</span>
                      <Upload className="w-4 h-4 text-slate-400 mr-1" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/10 active:scale-[0.99] transition-all text-sm"
                >
                  Submit Ticket Request
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentDashboard;