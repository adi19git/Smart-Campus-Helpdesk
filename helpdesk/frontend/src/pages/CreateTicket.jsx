import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../api/tickets';
import { Loader2, ArrowLeft, Home, Wifi, BookOpen, Zap, Droplets, Bus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'hostel', label: 'Hostel', icon: Home, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' },
  { value: 'network', label: 'Wi-Fi', icon: Wifi, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
  { value: 'classroom', label: 'Classroom', icon: BookOpen, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
  { value: 'electricity', label: 'Electricity', icon: Zap, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20' },
  { value: 'cleanliness', label: 'Cleanliness', icon: Droplets, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20' },
  { value: 'transport', label: 'Transport', icon: Bus, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' },
];

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'classroom',
    priority: 'low',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTicket(formData);
      toast.success('Ticket created successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          to="/"
          className="p-2.5 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Ticket</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Submit a new support request to the campus helpdesk</p>
        </div>
      </motion.div>

      {/* Category Selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 p-6"
      >
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Select Category</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = formData.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${isSelected
                    ? `${cat.color} ring-2 ring-offset-1 ring-blue-400 dark:ring-blue-500 dark:ring-offset-slate-800`
                    : 'border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                  }`}
              >
                <CatIcon className={`w-5 h-5 ${isSelected ? '' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className={`text-[11px] font-semibold ${isSelected ? '' : 'text-slate-500 dark:text-slate-400'}`}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm transition-all"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm transition-all resize-none"
              placeholder="Detailed explanation of what happened..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all border ${formData.priority === p
                      ? p === 'high'
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 ring-1 ring-rose-200 dark:ring-rose-500/20'
                        : p === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 ring-1 ring-amber-200 dark:ring-amber-500/20'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 ring-1 ring-emerald-200 dark:ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTicket;
