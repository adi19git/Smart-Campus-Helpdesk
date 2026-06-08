import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, differenceInHours } from 'date-fns';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadialBarChart, RadialBar,
} from 'recharts';
import {
  BarChart3, PieChart as PieIcon,
  Activity, Star, Users, Clock, CheckCircle, AlertCircle,
  Ticket, Zap, Flame, Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTickets } from '../api/tickets';
import StatsCard from '../components/ui/StatsCard';

/* ── Custom Tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl px-4 py-3 shadow-xl shadow-slate-900/10">
      <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-black">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Chart Card Wrapper ─────────────────────────────────────── */
const ChartCard = ({ title, subtitle, icon: Icon, children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

/* ── Mini Metric Pill ───────────────────────────────────────── */
const MetricPill = ({ label, value, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 p-4 shadow-sm"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
);


/* ── Gradient Definitions ───────────────────────────────────── */
const CATEGORY_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#e879f9', '#f472b6'];
const STATUS_COLORS = { open: '#6366f1', 'in-progress': '#3b82f6', closed: '#10b981' };
const PRIORITY_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

/* ════════════════════════════════════════════════════════════════
   ANALYTICS PAGE
   ════════════════════════════════════════════════════════════════ */
const Analytics = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'all' | '7d' | '30d'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTickets();
        setTickets(data.results || data);
      } catch {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Time-filtered tickets ─────────────────────────────────── */
  const filteredTickets = useMemo(() => {
    if (timeRange === 'all') return tickets;
    const days = timeRange === '7d' ? 7 : 30;
    const cutoff = subDays(new Date(), days);
    return tickets.filter(t => t.created_at && new Date(t.created_at) >= cutoff);
  }, [tickets, timeRange]);

  /* ── Core Stats ────────────────────────────────────────────── */
  const totalTickets = filteredTickets.length;
  const openTickets = filteredTickets.filter(t => t.status === 'open').length;
  const inProgressTickets = filteredTickets.filter(t => t.status === 'in-progress').length;
  const closedTickets = filteredTickets.filter(t => t.status === 'closed').length;
  const resolutionRate = totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0;

  /* ── Average Rating ────────────────────────────────────────── */
  const ratedTickets = filteredTickets.filter(t => t.rating);
  const avgRating = ratedTickets.length > 0
    ? (ratedTickets.reduce((s, t) => s + t.rating, 0) / ratedTickets.length).toFixed(1)
    : '—';

  /* ── Avg Resolution Time (hours) ───────────────────────────── */
  const resolvedWithDates = filteredTickets.filter(t => t.status === 'closed' && t.created_at && t.updated_at);
  const avgResolutionHrs = resolvedWithDates.length > 0
    ? Math.round(resolvedWithDates.reduce((s, t) => s + differenceInHours(new Date(t.updated_at), new Date(t.created_at)), 0) / resolvedWithDates.length)
    : '—';

  /* ── Category Distribution ─────────────────────────────────── */
  const categoryData = useMemo(() => {
    const counts = {};
    filteredTickets.forEach(t => {
      const cat = t.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        tickets: value,
      }))
      .sort((a, b) => b.tickets - a.tickets);
  }, [filteredTickets]);

  /* ── Status Distribution ───────────────────────────────────── */
  const statusData = useMemo(() => [
    { name: 'Open', value: openTickets, color: STATUS_COLORS.open },
    { name: 'In Progress', value: inProgressTickets, color: STATUS_COLORS['in-progress'] },
    { name: 'Closed', value: closedTickets, color: STATUS_COLORS.closed },
  ], [openTickets, inProgressTickets, closedTickets]);

  /* ── Priority Distribution ─────────────────────────────────── */
  const priorityData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    filteredTickets.forEach(t => {
      const p = t.priority || 'medium';
      if (counts[p] !== undefined) counts[p]++;
    });
    return [
      { name: 'Low', value: counts.low, color: PRIORITY_COLORS.low },
      { name: 'Medium', value: counts.medium, color: PRIORITY_COLORS.medium },
      { name: 'High', value: counts.high, color: PRIORITY_COLORS.high },
    ];
  }, [filteredTickets]);

  /* ── Trend Data (last 14 days) ─────────────────────────────── */
  const trendData = useMemo(() => {
    const days = {};
    // Populate all 14 days with zeros
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'MMM d');
      days[d] = { date: d, created: 0, resolved: 0 };
    }
    filteredTickets.forEach(t => {
      if (t.created_at) {
        const day = format(new Date(t.created_at), 'MMM d');
        if (days[day]) days[day].created++;
      }
      if (t.status === 'closed' && t.updated_at) {
        const day = format(new Date(t.updated_at), 'MMM d');
        if (days[day]) days[day].resolved++;
      }
    });
    return Object.values(days);
  }, [filteredTickets]);

  /* ── Rating Distribution ───────────────────────────────────── */
  const ratingDistribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredTickets.forEach(t => {
      if (t.rating && counts[t.rating] !== undefined) counts[t.rating]++;
    });
    return Object.entries(counts).map(([stars, count]) => ({
      stars: `${stars}★`,
      count,
    }));
  }, [filteredTickets]);

  /* ── Top Submitters ────────────────────────────────────────── */
  const topSubmitters = useMemo(() => {
    const counts = {};
    filteredTickets.forEach(t => {
      const u = t.user || 'Unknown';
      counts[u] = (counts[u] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredTickets]);

  /* ── Resolution Rate Gauge (for radial bar) ────────────────── */
  const gaugeData = useMemo(() => [
    { name: 'Resolution', value: resolutionRate, fill: resolutionRate >= 70 ? '#10b981' : resolutionRate >= 40 ? '#f59e0b' : '#ef4444' },
  ], [resolutionRate]);

  /* ── Category-by-Status Breakdown ──────────────────────────── */
  const categoryStatusData = useMemo(() => {
    const breakdown = {};
    filteredTickets.forEach(t => {
      const cat = (t.category || 'other').charAt(0).toUpperCase() + (t.category || 'other').slice(1);
      if (!breakdown[cat]) breakdown[cat] = { name: cat, open: 0, 'in-progress': 0, closed: 0 };
      breakdown[cat][t.status]++;
    });
    return Object.values(breakdown).sort((a, b) => (b.open + b['in-progress'] + b.closed) - (a.open + a['in-progress'] + a.closed));
  }, [filteredTickets]);

  /* ════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header + Time Range Filter ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analytics Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep insights into your helpdesk performance
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-1 shadow-sm">
          {[
            { key: 'all', label: 'All Time' },
            { key: '30d', label: '30 Days' },
            { key: '7d', label: '7 Days' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setTimeRange(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === opt.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Stat Cards Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Ticket}      value={totalTickets}      label="Total Complaints" color="violet" delay={0}    />
        <StatsCard icon={AlertCircle} value={openTickets}       label="Pending"          color="pink"   delay={0.05} />
        <StatsCard icon={Clock}       value={inProgressTickets} label="In Progress"      color="orange" delay={0.1}  />
        <StatsCard icon={CheckCircle} value={closedTickets}     label="Resolved"         color="green"  delay={0.15} />
      </div>

      {/* ── Secondary Metrics Row ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricPill icon={Zap}    label="Resolution Rate"    value={`${resolutionRate}%`}     color="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2}  />
        <MetricPill icon={Star}   label="Avg. Rating"        value={avgRating}                 color="bg-gradient-to-br from-amber-500 to-orange-600" delay={0.25} />
        <MetricPill icon={Clock}  label="Avg. Resolve Time"  value={typeof avgResolutionHrs === 'number' ? `${avgResolutionHrs}h` : avgResolutionHrs} color="bg-gradient-to-br from-blue-500 to-indigo-600" delay={0.3}  />
        <MetricPill icon={Users}  label="Total Submitters"   value={topSubmitters.length}      color="bg-gradient-to-br from-purple-500 to-fuchsia-600" delay={0.35} />
      </div>

      {/* ── Row 1: Trend + Resolution Gauge ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ticket Trend (created vs resolved) */}
        <ChartCard
          title="Ticket Trend"
          subtitle="Created vs resolved — last 14 days"
          icon={Activity}
          delay={0.3}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color, #e2e8f0)" strokeOpacity={0.4} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{v}</span>} />
              <Area type="monotone" dataKey="created" name="Created" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradCreated)" dot={false} activeDot={{ r: 5, strokeWidth: 2 }} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2.5} fill="url(#gradResolved)" dot={false} activeDot={{ r: 5, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Resolution Rate Gauge */}
        <ChartCard title="Resolution Rate" subtitle="Percentage of tickets resolved" icon={CheckCircle} delay={0.35}>
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                barSize={14}
                data={gaugeData}
                startAngle={210}
                endAngle={-30}
              >
                <RadialBar
                  background={{ fill: '#f1f5f9' }}
                  dataKey="value"
                  cornerRadius={12}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-28 mb-6">
              <p className="text-4xl font-black text-slate-900 dark:text-white">{resolutionRate}%</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {closedTickets} of {totalTickets} resolved
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 2: Category Bar + Status Donut + Priority ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Distribution */}
        <ChartCard title="Category Distribution" subtitle="Tickets by department" icon={BarChart3} delay={0.4}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} barSize={28} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tickets" radius={[0, 6, 6, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Status Donut */}
        <ChartCard title="Status Breakdown" subtitle="Current ticket states" icon={PieIcon} delay={0.45}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Priority Distribution */}
        <ChartCard title="Priority Distribution" subtitle="Tickets by urgency" icon={Flame} delay={0.5}>
          <div className="space-y-4 mt-2">
            {priorityData.map((item, i) => {
              const pct = totalTickets > 0 ? Math.round((item.value / totalTickets) * 100) : 0;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{item.value} <span className="font-semibold text-slate-400">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Priority summary */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">High Priority %</span>
              <span className={`text-xs font-black ${
                (totalTickets > 0 && (priorityData[2]?.value / totalTickets) > 0.3) ? 'text-red-500' : 'text-emerald-500'
              }`}>
                {totalTickets > 0 ? Math.round((priorityData[2]?.value / totalTickets) * 100) : 0}%
              </span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Category × Status + Rating Dist + Top Submitters ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category × Status Stacked Bar */}
        <ChartCard
          title="Category × Status"
          subtitle="Breakdown by department and state"
          icon={BarChart3}
          delay={0.55}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryStatusData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{v}</span>} />
              <Bar dataKey="open" name="Open" stackId="a" fill={STATUS_COLORS.open} radius={[0, 0, 0, 0]} />
              <Bar dataKey="in-progress" name="In Progress" stackId="a" fill={STATUS_COLORS['in-progress']} />
              <Bar dataKey="closed" name="Closed" stackId="a" fill={STATUS_COLORS.closed} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Right column: Rating Distribution + Top Submitters */}
        <div className="space-y-4">
          {/* Rating Distribution */}
          <ChartCard title="Rating Distribution" subtitle="Student feedback scores" icon={Star} delay={0.6}>
            <div className="space-y-2.5">
              {ratingDistribution.slice().reverse().map((item, i) => {
                const maxCount = Math.max(...ratingDistribution.map(r => r.count), 1);
                const pct = (item.count / maxCount) * 100;
                const starNum = 5 - i;
                return (
                  <motion.div
                    key={item.stars}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xs font-bold text-amber-500 w-7 text-right">{starNum}★</span>
                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.7 + i * 0.05, duration: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-6 text-right">{item.count}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-slate-900 dark:text-white">{avgRating}</span>
              </div>
            </div>
          </ChartCard>

          {/* Top Submitters */}
          <ChartCard title="Top Submitters" subtitle="Most active users" icon={Award} delay={0.65}>
            <div className="space-y-3">
              {topSubmitters.map((s, i) => (
                <motion.div
                  key={s.user}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 ${
                    i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                    i === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                    i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                    'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{s.user}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                    {s.count}
                  </span>
                </motion.div>
              ))}
              {topSubmitters.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-4">No data available</p>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
