import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
        toast.error('Failed to fetch tickets');
      }
    };
    fetchTickets();
  }, []);

  const activeTickets = tickets.filter(t => t.status !== 'closed');
  const openCount = activeTickets.filter(t => t.status === 'open').length;
  const inProgressCount = activeTickets.filter(t => t.status === 'in-progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'closed').length;

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed font-sans text-slate-800 flex items-center justify-center p-4 sm:p-8" 
         style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}>
      
      {/* Main Glass Container */}
      <div className="w-full max-w-[1400px] h-[85vh] bg-white/20 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex overflow-hidden">
        
        {/* Left Sidebar (Dark Glass) */}
        <div className="w-64 bg-[#1E2538]/90 backdrop-blur-2xl text-white flex flex-col p-6 border-r border-white/10 shrink-0">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <span className="font-bold text-xl">H</span>
            </div>
            <div className="font-bold leading-tight tracking-wide">
              Smart Campus<br/><span className="text-blue-300 font-medium">Helpdesk</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 bg-blue-500/20 text-blue-200 rounded-2xl border border-blue-500/30 transition-all font-semibold shadow-inner">
              <LayoutDashboard className="w-5 h-5" /> Dashboard <span className="ml-auto text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">Active</span>
            </button>
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-medium">
              <FileText className="w-5 h-5" /> My Tickets
            </button>
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-medium">
              <TicketIcon className="w-5 h-5" /> Raise Ticket
            </button>
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-medium">
              <Megaphone className="w-5 h-5" /> Announcements
            </button>
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-medium">
              <BarChart3 className="w-5 h-5" /> Analytics
            </button>
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
            <button className="flex w-full text-left items-center gap-4 px-4 py-3 bg-white/5 text-slate-200 rounded-2xl transition-all font-medium border border-white/5">
              <Settings className="w-5 h-5 text-purple-400" /> Settings
            </button>
            <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-medium">
              <User className="w-5 h-5" /> Profile
            </button>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10 gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Nexus Campus Support" 
                className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-500 shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Stats Pill */}
              <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 shadow-sm text-sm font-bold">
                <span className="text-slate-700">124</span>
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px]">3</span>
                <span className="text-slate-700">5.3</span>
                <span className="text-emerald-600">124</span>
              </div>
              
              <button className="relative p-2.5 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm hover:bg-white/80 transition-all">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md pl-2 pr-4 py-1.5 rounded-2xl border border-white/60 shadow-sm cursor-pointer hover:bg-white/80 transition-all">
                <div className="w-8 h-8 rounded-xl bg-blue-200 overflow-hidden border border-white">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4" alt="avatar" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-slate-800 leading-none">Sarah Jenkins</div>
                  <div className="text-[10px] text-slate-500 font-medium">2109405</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Student View</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">Open Tickets</span>
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">3</span>
              </div>
              <div className="text-4xl font-black text-slate-800">{openCount || 3}</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">In Progress</span>
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">5</span>
              </div>
              <div className="text-4xl font-black text-slate-800">{inProgressCount || 5}</div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">Resolved</span>
                <span className="text-xs font-bold text-emerald-500">124</span>
              </div>
              <div className="text-4xl font-black text-slate-800">{resolvedCount || 124}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search issues or knowledge base..." 
                className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-500 shadow-sm"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowWorkflow(!showWorkflow)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-white/20"
              >
                <Plus className="w-4 h-4" /> Raise New Ticket
              </button>
              
              {/* Workflow Dropdown / Popup */}
              {showWorkflow && (
                <div className="absolute top-full mt-4 right-0 w-80 bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-6 z-50 animate-fade-in-up">
                  <h3 className="text-center font-bold text-lg mb-6">Workflow</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Home className="text-rose-400" /></div>
                      <span className="text-xs font-bold text-slate-700">Hostel</span>
                    </button>
                    <button className="flex flex-col items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Monitor className="text-emerald-500" /></div>
                      <span className="text-xs font-bold text-slate-700">IT</span>
                    </button>
                    <button className="flex flex-col items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><BookOpen className="text-blue-500" /></div>
                      <span className="text-xs font-bold text-slate-700">Classroom</span>
                    </button>
                    <button className="flex flex-col items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><Droplets className="text-cyan-500" /></div>
                      <span className="text-xs font-bold text-slate-700">Cleanliness</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h3 className="font-bold text-slate-800 mb-4">My Active Tickets</h3>
          
          {/* Active Tickets Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Ticket Card 1 */}
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm hover:bg-white/60 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-slate-500">Ticket #2941</span>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">Red</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-lg leading-tight mb-2">Hostel Room 301B -<br/>Electricity Issue</h4>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-bold text-slate-600">High Priority</span>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-xl">In Progress</span>
                  <span className="text-[10px] font-semibold text-slate-400">2 hrs ago</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Ticket Card 2 */}
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm hover:bg-white/60 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-slate-500">Ticket #2940</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-lg leading-tight mb-2">Wi-Fi Connectivity<br/>Library</h4>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-slate-600">Medium</span>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-xl">Open</span>
                  <span className="text-[10px] font-semibold text-slate-400">1 day ago</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

             {/* Ticket Card 3 */}
             <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm hover:bg-white/60 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-slate-500">Ticket #2938</span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Open</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-lg leading-tight mb-2">Classroom B-102<br/>Projector</h4>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-slate-600">Medium</span>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-xl">Resolved</span>
                  <span className="text-[10px] font-semibold text-slate-400">3 days ago</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Panel (Raise Ticket Form) */}
        <div className="w-80 bg-white/60 backdrop-blur-2xl p-6 flex flex-col border-l border-white/50 shrink-0 overflow-y-auto custom-scrollbar">
          
          <h3 className="font-extrabold text-lg text-slate-800 mb-1">Raise Ticket</h3>
          
          {/* Progress Steps */}
          <div className="flex items-center text-[10px] font-bold text-slate-400 mb-6 w-full">
            <span className="text-slate-800">1: Category</span>
            <div className="flex-1 h-0.5 bg-slate-300 mx-2"><div className="w-1/2 h-full bg-blue-500"></div></div>
            <span>2: Details</span>
            <div className="flex-1 h-0.5 bg-slate-300 mx-2"></div>
            <span>3: Review</span>
          </div>

          <div className="space-y-4 flex-1">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Hostel</option>
                <option>IT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sub-category</label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Electricity/Power Failure</option>
                <option>Water Leakage</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input type="text" value="Block C, Room 301B" readOnly className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input type="text" value="Light flickering & outlet failure" readOnly className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea rows="3" readOnly className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none">
AC outlet not working, overhead light flickering constantly since yesterday.
              </textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attachments</label>
              <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-xs font-semibold text-slate-600 flex-1 truncate">'light_flickr.jpg'</span>
                <Upload className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
            </div>

          </div>

          <button className="w-full mt-6 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm">
            Submit Ticket
          </button>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
