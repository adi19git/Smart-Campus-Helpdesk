import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    open: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20',
    'in-progress': 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
    closed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center rounded-md font-bold uppercase tracking-wide ring-1 ring-inset ${styles[status] || styles.open} ${sizes[size]}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority, size = 'sm' }) => {
  const styles = {
    high: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
    medium: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
    low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center rounded-md font-bold uppercase tracking-wide ring-1 ring-inset ${styles[priority] || styles.low} ${sizes[size]}`}>
      {priority}
    </span>
  );
};

export default StatusBadge;
