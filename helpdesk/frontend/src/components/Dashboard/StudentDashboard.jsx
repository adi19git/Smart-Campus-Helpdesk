import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, LayoutDashboard, Ticket as TicketIcon, FileText,
  Megaphone, BarChart3, Settings, User, Plus, Home, Monitor,
  BookOpen, Droplets, Trash2, Edit3, Image as ImageIcon, Upload
} from 'lucide-react';
import { getTickets } from '../../api/tickets';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data.results || data);
      } catch (err) {
        // Safe fallback matching UI states if API is offline
        setTickets([
          { id: '2941', title: 'Hostel Room 301B - Electricity Issue', status: 'in-progress', priority: 'High', time: '2 hrs ago', tag: 'Red' },
          { id: '2940', title: 'Wi-Fi Connectivity Library', status: 'open', priority: 'Medium', time: '1 day ago' },
          { id: '2938', title: 'Classroom B-102 Projector', status: 'closed', priority: 'Medium', time: '3 days ago' },
        ]);
        toast.error('Failed to fetch tickets. Using offline cache.');
      }
    };
    fetchTickets();
  }, []);

  const activeTickets = tickets.filter(t => t.status !== 'closed');
  const openCount = activeTickets.filter(t => t.status === 'open').length;
  const inProgressCount = activeTickets.filter(t => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'closed').length;

  return (
    <div className="min-h-screen w-full font-sans text-slate-100 flex items-center justify-center p-4 md:p-6 bg-[#0B0F19] relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Shell Container */}
      <div className="w-full max-w-[1440px] h-[88vh] bg-[#111625]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex overflow-hidden">

        {/* Left Sidebar Layout */}
        <div className="w-64 bg-[#0D111C]/90 backdrop-blur-2xl flex flex-col p-6 border-r border-white/5 shrink-0 hidden md:flex">

          {/* Platform Identity */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/10">
              <span className="font-black text-xl text-white tracking-tighter">S</span>
            </div>
            <div className="font-bold text-sm tracking-wide leading-tight text-slate-200">
              SmartHelp <br /><span className="text-xs text-blue-400 font-medium tracking-normal">Campus Support</span>
            </div>
          </div>

          {/* Core Navigation Hooks */}
          <nav className="flex-1 space-y-1">
            <button className="flex w-full text-left items-center gap-3.5 px-4 py-3 bg-blue-500/15 text-blue-400 rounded-xl border border-blue-500/20 font-semibold transition-all">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs tracking-wide">Dashboard</span>
              <span className="ml-auto text-[9px] bg-blue-500 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase">Live</span>
            </button>
            {[
              { name: 'My Tickets', icon: FileText },
              { name: 'Raise Ticket', icon: TicketIcon },
              { name: 'Announcements', icon: Megaphone },
              { name: 'Analytics', icon: BarChart3 }
            ].map((item) => (
              <button key={item.name} className="flex w-full text-left items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] rounded-xl transition-all font-medium text-xs tracking-wide group">
                <item.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Control Anchors */}
          <div className="mt-auto space-y-1 pt-4 border-t border-white/5">
            <button className="flex w-full text-left items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] rounded-xl transition-all font-medium text-xs tracking-wide">
              <Settings className="w-4 h-4 text-purple-400" /> Settings
            </button>
            <button onClick={logout} className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-medium text-xs tracking-wide">
              <User className="w-4 h-4" /> Profile
            </button>
          </div>
        </div>

        {/* Workspace Canvas (Center Content) */}
        <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-[#0E121F]/40">

          {/* Top Operational Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ticket logs or knowledge base..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#141A29]/60 border border-white/5 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Numeric KPIs Container */}
              <div className="flex items-center gap-3 bg-[#131926]/90 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold text-slate-300 shadow-sm">
                <span>124</span>
                <span className="w-4 h-4 rounded bg-red-500/10 text-red-400 flex items-center justify-center text-[9px] font-black">3</span>
                <span className="text-slate-500">|</span>
                <span>5.3</span>
                <span className="text-emerald-400 font-black">124</span>
              </div>

              <button className="relative p-2.5 bg-[#131926]/90 border border-white/5 rounded-xl text-slate-400 hover:text-slate-200 transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              </button>

              <div className="flex items-center gap-2.5 bg-[#131926]/90 pl-2 pr-3 py-1.5 rounded-xl border border-white/5 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-900/50 overflow-hidden border border-white/10">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4" alt="user avatar" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-200 leading-none">Sarah Jenkins</div>
                  <div className="text-[9px] text-slate-500 font-semibold mt-1">ID: 2109405</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Identification Title */}
          <div className="mb-6">
            <h2 className="text-xl font-black text-white tracking-tight">Student Workspace Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Monitor active system tickets and request dispatches</p>
          </div>

          {/* Analytical Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Open Tickets', current: openCount || 3, marker: '3', theme: 'from-red-500/10 to-transparent border-red-500/10 text-red-400' },
              { label: 'In Progress', current: inProgressCount || 5, marker: '5', theme: 'from-amber-500/10 to-transparent border-amber-500/10 text-amber-400' },
              { label: 'Resolved Tickets', current: resolvedCount || 124, marker: '124', theme: 'from-emerald-500/10 to-transparent border-emerald-500/10 text-emerald-400' }
            ].map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.theme} bg-[#131826]/40 border p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:scale-[1.01] transition-transform duration-300`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">{card.label}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/5">{card.marker}</span>
                </div>
                <div className="text-3xl font-black tracking-tight text-white">{card.current}</div>
              </div>
            ))}
          </div>

          {/* Ticket Generation Control Strip */}
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search issue registry catalog..."
                className="w-full pl-11 pr-4 py-3 bg-[#131826]/40 border border-white/5 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowWorkflow(!showWorkflow)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition-all border border-white/10"
              >
                <Plus className="w-3.5 h-3.5" /> Raise New Ticket
              </button>

              {/* Dynamic Categorization Selector Dropdown Popover */}
              <AnimatePresence>
                {showWorkflow && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 right-0 w-72 bg-[#121624] border border-white/10 shadow-2xl rounded-xl p-3 z-30"
                  >
                    <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 text-center mb-2.5">Workflow Routing Target</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Hostel', icon: Home, color: 'text-rose-400 bg-rose-500/5 border-rose-500/10' },
                        { name: 'IT Infrastructure', icon: Monitor, color: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10' },
                        { name: 'Classrooms', icon: BookOpen, color: 'text-blue-400 bg-blue-500/5 border-blue-500/10' },
                        { name: 'Sanitation', icon: Droplets, color: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/10' }
                      ].map((cell) => (
                        <button
                          key={cell.name}
                          onClick={() => setShowWorkflow(false)}
                          className={`flex flex-col items-center p-3 border rounded-xl hover:bg-white/[0.02] transition-colors ${cell.color}`}
                        >
                          <cell.icon className="w-5 h-5 mb-1.5" />
                          <span className="text-[11px] font-bold tracking-tight">{cell.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <h3 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-3.5">My Active Tickets</h3>

          {/* Main Logs Display Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {tickets.map((t, idx) => (
              <div
                key={t.id || idx}
                className="bg-[#131826]/40 border border-white/5 p-5 rounded-2xl flex flex-col group relative hover:border-white/10 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-[10px] font-bold text-slate-500">TICKET LNK-{t.id || '2938'}</span>
                  {t.tag && (
                    <span className="text-[9px] font-black tracking-wider text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10 uppercase">{t.tag}</span>
                  )}
                </div>

                <h4 className="font-bold text-slate-100 text-sm leading-snug mb-3 max-w-[90%]">
                  {t.title || 'Target Asset Disruption Title'}
                </h4>

                <div className="flex items-center gap-1.5 mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${t.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-500'}`} />
                  <span className="text-[11px] font-medium text-slate-400">{t.priority || 'Medium'} Urgency Matrix</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${t.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                      t.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/10' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                      }`}>
                      {t.status}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">{t.time}</span>
                  </div>

                  <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Form Pipeline Drawer Panel (Right Side) */}
        <div className="w-80 bg-[#0D111C]/90 backdrop-blur-2xl p-6 flex flex-col border-l border-white/5 shrink-0 overflow-y-auto custom-scrollbar hidden lg:flex">

          <h3 className="font-black text-sm uppercase tracking-wider text-slate-200 mb-0.5">Raise System Ticket</h3>
          <p className="text-[11px] text-slate-500 font-medium mb-4">File a technical work request dispatch</p>

          {/* Milestone Step Progress Line Indicator */}
          <div className="flex items-center text-[9px] font-bold text-slate-500 mb-5 w-full uppercase tracking-wider">
            <span className="text-blue-400 font-black">1: Category</span>
            <div className="flex-1 h-[2px] bg-white/5 mx-2"><div className="w-1/2 h-full bg-blue-500" /></div>
            <span>2: Context</span>
            <div className="flex-1 h-[2px] bg-white/5 mx-2" />
            <span>3: Review</span>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Category Selection</label>
              <select className="w-full px-3 py-2 bg-[#141926] border border-white/5 rounded-xl text-xs font-semibold text-slate-300 outline-none focus:border-blue-500/40 transition-colors">
                <option>Hostel</option>
                <option>IT Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Functional Sub-category</label>
              <select className="w-full px-3 py-2 bg-[#141926] border border-white/5 rounded-xl text-xs font-semibold text-slate-300 outline-none focus:border-blue-500/40 transition-colors">
                <option>Electricity/Power Failure</option>
                <option>Water Leakage</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset Zone</label>
                <input type="text" value="Block C, Room" readOnly className="w-full px-3 py-2 bg-[#141926]/40 border border-white/5 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority Map</label>
                <select className="w-full px-3 py-2 bg-[#141926] border border-white/5 rounded-xl text-xs font-semibold text-slate-300 outline-none focus:border-blue-500/40 transition-colors">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject Heading Line</label>
              <input type="text" value="Light flickering & outlet failure" readOnly className="w-full px-3 py-2 bg-[#141926]/40 border border-white/5 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contextual Breakdown Description</label>
              <textarea rows="3" readOnly className="w-full px-3 py-2 bg-[#141926]/40 border border-white/5 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed outline-none resize-none leading-relaxed">
                AC outlet not working, overhead light flickering constantly since yesterday.
              </textarea>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Manifest Attachments</label>
              <div className="flex items-center gap-2.5 p-2 bg-[#141926] border border-white/5 rounded-xl hover:border-white/10 transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex-1 truncate">'light_flickr.jpg'</span>
                <Upload className="w-3.5 h-3.5 text-slate-500 mr-1" />
              </div>
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/15 text-xs uppercase tracking-wider active:scale-[0.99]">
            Submit Dispatch Ticket
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;