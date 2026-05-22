import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatsCard — vibrant solid-color metric card.
 *
 * Matches the reference style: bold rounded rectangle with a full-bleed
 * background color, large white icon on the left, and value + label on
 * the right. Subtle inner highlight and shadow for depth.
 *
 * Props:
 *  icon    — Lucide icon component
 *  value   — numeric or string metric
 *  label   — short description text
 *  trend   — optional number (positive = up, negative = down)
 *  color   — 'violet' | 'orange' | 'blue' | 'green' | 'pink' | 'indigo' | 'rose' | 'amber' | 'emerald'
 *  delay   — framer-motion entrance delay (seconds)
 */

const PALETTES = {
  // [background, shadow color, inner highlight]
  violet:  { bg: '#7C3AED', shadow: 'rgba(124,58,237,0.40)', hi: 'rgba(255,255,255,0.10)' },
  indigo:  { bg: '#6366F1', shadow: 'rgba(99,102,241,0.40)',  hi: 'rgba(255,255,255,0.10)' },
  blue:    { bg: '#2563EB', shadow: 'rgba(37,99,235,0.40)',   hi: 'rgba(255,255,255,0.10)' },
  orange:  { bg: '#F97316', shadow: 'rgba(249,115,22,0.40)',  hi: 'rgba(255,255,255,0.12)' },
  amber:   { bg: '#D97706', shadow: 'rgba(217,119,6,0.40)',   hi: 'rgba(255,255,255,0.12)' },
  green:   { bg: '#16A34A', shadow: 'rgba(22,163,74,0.40)',   hi: 'rgba(255,255,255,0.10)' },
  emerald: { bg: '#059669', shadow: 'rgba(5,150,105,0.40)',   hi: 'rgba(255,255,255,0.10)' },
  pink:    { bg: '#EC4899', shadow: 'rgba(236,72,153,0.40)',  hi: 'rgba(255,255,255,0.10)' },
  rose:    { bg: '#E11D48', shadow: 'rgba(225,29,72,0.40)',   hi: 'rgba(255,255,255,0.10)' },
};

const StatsCard = ({ icon: Icon, value, label, trend, color = 'violet', delay = 0 }) => {
  const palette = PALETTES[color] || PALETTES.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: palette.bg,
        boxShadow: `0 8px 24px ${palette.shadow}, 0 2px 8px rgba(0,0,0,0.12)`,
        borderRadius: 18,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Inner top-left highlight shimmer */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '50%',
        background: `linear-gradient(180deg, ${palette.hi} 0%, transparent 100%)`,
        borderRadius: '18px 18px 0 0',
        pointerEvents: 'none',
      }} />

      {/* Decorative background circle */}
      <div style={{
        position: 'absolute',
        width: 110, height: 110,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        right: -28, bottom: -28,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 60, height: 60,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        right: 40, top: -20,
        pointerEvents: 'none',
      }} />

      {/* Icon container */}
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backdropFilter: 'blur(4px)',
        }}
      >
        <Icon size={24} color="white" strokeWidth={2} />
      </motion.div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Metric dots (decorative, like reference image) */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.9)' }} />
          <div style={{ width: 14, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.45)' }} />
          <div style={{ width: 8,  height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* Value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.15, duration: 0.4 }}
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {value}
          </motion.p>
          {trend !== undefined && trend !== null && (
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: trend >= 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,200,200,0.9)',
              background: 'rgba(255,255,255,0.15)',
              padding: '1px 6px',
              borderRadius: 6,
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>

        {/* Label */}
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.75)',
          marginTop: 3,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
