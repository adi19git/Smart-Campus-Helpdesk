import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, value, label, trend, color = 'blue', delay = 0 }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 ring-blue-100 dark:ring-blue-500/20',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 ring-rose-100 dark:ring-rose-500/20',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 ring-amber-100 dark:ring-amber-500/20',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-500/20',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 ring-indigo-100 dark:ring-indigo-500/20',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 ring-violet-100 dark:ring-violet-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-4 hover:shadow-md transition-shadow group"
    >
      <div className={`p-3.5 rounded-2xl ring-1 ${colors[color] || colors.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{label}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
          {trend && (
            <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
