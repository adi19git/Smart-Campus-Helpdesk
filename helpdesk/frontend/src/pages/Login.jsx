import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap, ClipboardList, LineChart, Zap, Ticket,
  MessageSquare, ShieldCheck, User as UserIcon, Lock, Eye,
  EyeOff, CheckCircle2, Sun, Moon, ArrowRight, Loader2, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Constants ─────────────────────────────────────── */
const FEATURES = [
  { icon: ClipboardList, label: 'Submit Complaints',       desc: 'Report issues in seconds, effortlessly.' },
  { icon: LineChart,     label: 'Track Requests',          desc: 'Real-time status updates at a glance.' },
  { icon: Zap,           label: 'Real-Time Updates',       desc: 'Instant notifications on every change.' },
  { icon: CheckCircle2,  label: 'Faster Resolution',       desc: 'Quick turnaround from dedicated staff.' },
  { icon: Ticket,        label: 'Smart Ticket Management', desc: 'Intelligent routing to the right team.' },
  { icon: MessageSquare, label: 'Transparent Communication', desc: 'Clear dialogue, every step of the way.' },
];

const STUDENT_COLORS = {
  primary:      '#2563EB',
  primaryLight: '#3B82F6',
  primaryGlow:  'rgba(37,99,235,0.35)',
  gradient:     'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)',
  tabGradient:  'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  orb1:         'rgba(37,99,235,0.22)',
  orb2:         'rgba(6,182,212,0.18)',
};

const ADMIN_COLORS = {
  primary:      '#7C3AED',
  primaryLight: '#8B5CF6',
  primaryGlow:  'rgba(124,58,237,0.35)',
  gradient:     'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #8B5CF6 100%)',
  tabGradient:  'linear-gradient(135deg, #5B21B6, #8B5CF6)',
  orb1:         'rgba(124,58,237,0.22)',
  orb2:         'rgba(236,72,153,0.15)',
};

/* ─── Feature Card ────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, label, desc, index, colors, isDark }) => (
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ x: 6, scale: 1.02 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      cursor: 'default',
      transition: 'background 0.2s',
    }}
  >
    <motion.div
      whileHover={{ rotate: 10, scale: 1.1 }}
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `rgba(255,255,255,0.08)`,
        border: '1px solid rgba(255,255,255,0.12)',
        flexShrink: 0,
      }}
    >
      <Icon size={15} color="rgba(255,255,255,0.85)" />
    </motion.div>
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginBottom: 1 }}>{label}</p>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{desc}</p>
    </div>
  </motion.div>
);

/* ─── Floating Label Input ────────────────────────────── */
const FloatingInput = ({ id, label, type, value, onChange, icon: Icon, rightElement, colors, isDark, autoFocus }) => {
  const [focused, setFocused]   = useState(false);
  const isLifted = focused || !!value;

  const borderColor = focused
    ? colors.primary
    : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';

  const boxShadow = focused
    ? `0 0 0 3px ${colors.primaryGlow}, 0 1px 3px rgba(0,0,0,0.1)`
    : 'none';

  return (
    <div style={{ position: 'relative', marginBottom: 20 }}>
      <div
        style={{
          position: 'relative',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 12,
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
          boxShadow,
          transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Icon */}
        <div style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', zIndex: 2,
        }}>
          <Icon
            size={16}
            color={focused ? colors.primary : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'}
            style={{ transition: 'color 0.25s' }}
          />
        </div>

        {/* Floating Label */}
        <motion.label
          htmlFor={id}
          animate={{
            top: isLifted ? 8 : '50%',
            translateY: isLifted ? 0 : '-50%',
            fontSize: isLifted ? 10 : 13,
            color: focused
              ? colors.primary
              : isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: 42,
            fontWeight: 600,
            letterSpacing: isLifted ? '0.04em' : 0,
            pointerEvents: 'none',
            zIndex: 2,
            textTransform: isLifted ? 'uppercase' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </motion.label>

        <input
          id={id}
          type={type}
          value={value}
          autoFocus={autoFocus}
          autoComplete={type === 'password' ? 'current-password' : 'username'}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            paddingTop: 22,
            paddingBottom: 8,
            paddingLeft: 42,
            paddingRight: rightElement ? 44 : 14,
            fontSize: 13,
            fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.85)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            borderRadius: 12,
            boxSizing: 'border-box',
          }}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Main Login Component ────────────────────────────── */
const Login = () => {
  const [loginType, setLoginType]       = useState('student');
  const [username,  setUsername]        = useState('');
  const [password,  setPassword]        = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [loginState, setLoginState]     = useState('idle'); // idle | loading | success | error

  const { login }       = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate        = useNavigate();
  const cardRef         = useRef(null);

  const colors = loginType === 'student' ? STUDENT_COLORS : ADMIN_COLORS;

  // Reset state when switching tabs
  useEffect(() => {
    setUsername('');
    setPassword('');
    setLoginState('idle');
  }, [loginType]);

  // Mouse tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const getErrorMessage = (err) => {
    if (err.response) {
      const data = err.response.data;
      if (data?.detail) return data.detail;
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const value = data[firstKey];
          return Array.isArray(value) ? value[0] : String(value);
        }
      }
      if (err.response.status === 401) return 'Invalid credentials. Please check and try again.';
      if (err.response.status === 429) return 'Too many attempts. Please wait and try again.';
      if (err.response.status >= 500)  return 'Server error. Please try again later.';
    }
    if (err.code === 'ECONNABORTED') return 'Request timed out. Check your connection.';
    if (!err.response) return 'Network error. Please check your internet connection.';
    return 'Login failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsLoading(true);
    setLoginState('loading');

    try {
      await login(username.trim(), password);
      setLoginState('success');
      toast.success(`Welcome back! Signed in as ${loginType === 'admin' ? 'Admin' : 'Student'}.`, {
        style: { borderRadius: '12px', fontWeight: 600, fontSize: '13px' },
      });
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      setLoginState('error');
      toast.error(getErrorMessage(err), {
        style: { borderRadius: '12px', fontWeight: 600, fontSize: '13px' },
      });
      setTimeout(() => setLoginState('idle'), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Button label/icon ── */
  const btnContent = () => {
    if (loginState === 'loading') return <Loader2 size={18} className="animate-spin" />;
    if (loginState === 'success') return <Check size={18} />;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        Sign In
        <motion.span initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
          <ArrowRight size={15} />
        </motion.span>
      </span>
    );
  };

  const btnBg = loginState === 'success'
    ? 'linear-gradient(135deg, #10B981, #059669)'
    : loginState === 'error'
    ? 'linear-gradient(135deg, #EF4444, #DC2626)'
    : colors.gradient;

  /* ─── Dark mode palette ─── */
  const bg        = isDark ? '#080B14' : '#F1F5FF';
  const cardBg    = isDark ? 'rgba(15,20,40,0.82)' : 'rgba(255,255,255,0.85)';
  const cardBorder= isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)';
  const textPrimary   = isDark ? 'rgba(255,255,255,0.95)' : '#0F172A';
  const textSecondary = isDark ? 'rgba(255,255,255,0.45)' : '#64748B';
  const dividerColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const checkBg       = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';

  return (
    <>
      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&family=Outfit:wght@700;800;900&display=swap');

        .login-root { font-family: 'Inter', system-ui, sans-serif; }
        .login-heading { font-family: 'Outfit', 'Inter', sans-serif; }

        @keyframes loginOrb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.1); }
          66%      { transform: translate(-20px,20px) scale(0.95); }
        }
        @keyframes loginOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-35px,25px) scale(1.08); }
          66%      { transform: translate(20px,-15px) scale(0.97); }
        }
        @keyframes loginOrb3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(15px,-20px) scale(1.05); }
        }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes particleFloat {
          0%   { opacity:0; transform: translateY(0) scale(0.5); }
          20%  { opacity:0.6; }
          80%  { opacity:0.4; }
          100% { opacity:0; transform: translateY(-120px) scale(1.2); }
        }
        @keyframes cardFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes checkmarkDraw {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes badgePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.7; transform:scale(0.95); }
        }

        /*
         * GRADIENT TEXT FIX — Chrome/Chromium:
         * -webkit-background-clip:text breaks inside any GPU compositing layer.
         * Compositing is triggered by: transform animations, filter animations,
         * will-change:transform/opacity, or opacity < 1 on a parent.
         *
         * Solution: the h1 containing the gradient span uses a CSS @keyframes
         * that animates ONLY opacity (no transform). Pure CSS opacity animation
         * does NOT create a transform compositing layer, so background-clip:text
         * is preserved. No framer-motion, no filter on this element.
         */
        @keyframes headlineFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .headline-fadein {
          animation: headlineFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }
        /* The gradient span: static — zero animations = guaranteed correct clip */
        .helpdesk-gradient {
          display: inline;
        }

        .login-card-float { animation: cardFloat 5s ease-in-out infinite; }

        .login-btn-shimmer {
          position: relative;
          overflow: hidden;
        }
        .login-btn-shimmer::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmerSweep 2.5s infinite;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          pointer-events: none;
        }

        .focus-ring:focus-visible {
          outline: 2px solid ${colors.primary};
          outline-offset: 2px;
        }
      `}</style>

      <div
        className="login-root"
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          background: bg,
          overflow: 'hidden',
          position: 'relative',
          transition: 'background 0.4s ease',
        }}
      >
        {/* ═══════════════ LEFT PANEL ═══════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            display: 'none',
            flex: '0 0 48%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px 40px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #0A0F1E 0%, #0D1535 40%, #0A0B1A 100%)',
          }}
          className="md-panel"
          id="left-panel"
        >
          {/* Animated background gradient */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(-45deg, #0a1628, #0f2040, #1a1040, #0a0f1e)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 18s ease infinite',
          }} />

          {/* Orbs */}
          <motion.div style={{
            position: 'absolute', width: 420, height: 420, borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
            filter: 'blur(50px)', top: -100, left: -60, pointerEvents: 'none',
            animation: 'loginOrb1 20s ease-in-out infinite',
          }} />
          <motion.div style={{
            position: 'absolute', width: 350, height: 350, borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
            filter: 'blur(50px)', bottom: -80, right: -40, pointerEvents: 'none',
            animation: 'loginOrb2 25s ease-in-out infinite',
          }} />
          <motion.div style={{
            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)', top: '45%', right: '15%', pointerEvents: 'none',
            animation: 'loginOrb3 15s ease-in-out infinite',
          }} />

          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />

          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              style={{
                width: 44, height: 44, borderRadius: 13,
                background: colors.gradient,
                boxShadow: `0 8px 24px ${colors.primaryGlow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <GraduationCap size={22} color="white" />
            </motion.div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: 14, lineHeight: 1.2, fontFamily: 'Outfit, sans-serif' }}>
                Smart Campus
              </p>
              <p style={{ color: colors.primaryLight, fontWeight: 600, fontSize: 12, lineHeight: 1.2 }}>
                Helpdesk Platform
              </p>
            </div>
          </motion.div>

          {/* ── Hero Content ── */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0' }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                marginBottom: 20, width: 'fit-content',
                padding: '5px 12px 5px 8px',
                borderRadius: 100,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: 'badgePulse 3s ease-in-out infinite',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: colors.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={10} color="white" fill="white" />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
                Unified Campus Platform v2.0
              </span>
            </motion.div>

            {/* Headline */}
            {/*
              SVG gradient text — bulletproof across all browsers and compositing contexts.
              CSS background-clip:text breaks when ANY ancestor has a CSS transform,
              even transform:translateX(0). SVG linearGradient is immune to this.
            */}
            <h1
              className="login-heading headline-fadein"
              style={{
                fontSize: 'clamp(1.9rem, 3vw, 2.7rem)',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.97)',
                lineHeight: 1.13,
                marginBottom: 16,
                letterSpacing: '-0.025em',
              }}
            >
              Smart Campus<br />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  overflow: 'visible',
                  display: 'block',
                  height: '1.15em',
                  width: 'auto',
                  marginTop: '0.05em',
                }}
                aria-label="Helpdesk"
              >
                <defs>
                  <linearGradient id={`hd-grad-${loginType}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    {loginType === 'student' ? (
                      <>
                        <stop offset="0%"   stopColor="#1D4ED8" />
                        <stop offset="50%"  stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%"   stopColor="#5B21B6" />
                        <stop offset="50%"  stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </>
                    )}
                  </linearGradient>
                </defs>
                <text
                  x="0"
                  y="0.9em"
                  fill={`url(#hd-grad-${loginType})`}
                  fontFamily="Outfit, Inter, sans-serif"
                  fontWeight="900"
                  fontSize="1em"
                  style={{ transition: 'fill 0.4s ease' }}
                >
                  Helpdesk
                </text>
              </svg>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 13.5,
                lineHeight: 1.65,
                maxWidth: 310,
                marginBottom: 32,
              }}
            >
              Connecting Students and Administration Efficiently<br />Through One Unified Platform
            </motion.p>

            {/* Feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.label} {...f} index={i} colors={colors} isDark={true} />
              ))}
            </div>
          </div>

          {/* ── Bottom trust bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: 8,
              paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ display: 'flex' }}>
              {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'].map((c, i) => (
                <div key={i} style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: c,
                  border: '2.5px solid rgba(15,20,40,0.9)',
                  marginLeft: i > 0 ? -9 : 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }} />
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, marginLeft: 4 }}>
              Trusted by <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>1,200+</span> students & staff
            </p>
          </motion.div>
        </motion.div>

        {/* ═══════════════ RIGHT PANEL ═══════════════ */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            position: 'relative',
            minHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          {/* Background orbs for right side */}
          <div style={{
            position: 'fixed', width: 500, height: 500, borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 65%)`,
            filter: 'blur(80px)', top: -150, right: -150, pointerEvents: 'none', zIndex: 0,
            animation: 'loginOrb1 22s ease-in-out infinite',
          }} />
          <div style={{
            position: 'fixed', width: 400, height: 400, borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 65%)`,
            filter: 'blur(70px)', bottom: -100, left: -100, pointerEvents: 'none', zIndex: 0,
            animation: 'loginOrb2 28s ease-in-out infinite',
          }} />

          {/* Dark mode toggle */}
          <motion.button
            id="theme-toggle-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            style={{
              position: 'fixed',
              top: 20, right: 20,
              width: 40, height: 40,
              borderRadius: '50%',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
            className="focus-ring"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={16} color="rgba(255,255,255,0.85)" />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={16} color="#475569" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ── Login Card ── */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              rotateX, rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: 420,
            }}
          >
            <div
              className="login-card-float"
              style={{
                background: cardBg,
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: `1px solid ${cardBorder}`,
                borderRadius: 28,
                padding: '36px 32px 32px',
                boxShadow: isDark
                  ? `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)`
                  : `0 40px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,1)`,
              }}
            >
              {/* ── Card Header ── */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                style={{ textAlign: 'center', marginBottom: 28 }}
              >
                <motion.div
                  whileHover={{ scale: 1.06, rotate: -3 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 60, height: 60, borderRadius: 18,
                    background: colors.gradient,
                    boxShadow: `0 12px 28px ${colors.primaryGlow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={loginType}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 20 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {loginType === 'student'
                        ? <GraduationCap size={28} color="white" />
                        : <ShieldCheck size={28} color="white" />
                      }
                    </motion.span>
                  </AnimatePresence>
                </motion.div>

                <motion.h2
                  className="login-heading"
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: textPrimary,
                    marginBottom: 5,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Welcome Back
                </motion.h2>
                <p style={{ color: textSecondary, fontSize: 13, fontWeight: 500 }}>
                  Sign in to access your {loginType === 'admin' ? 'admin dashboard' : 'student portal'}
                </p>
              </motion.div>

              {/* ── Role Toggle ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                style={{ marginBottom: 28 }}
              >
                <div
                  id="role-toggle"
                  role="tablist"
                  aria-label="Login type"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    padding: 4,
                    borderRadius: 16,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${dividerColor}`,
                  }}
                >
                  {/* Sliding indicator */}
                  <motion.div
                    layout
                    layoutId="tab-slider"
                    animate={{
                      left: loginType === 'student' ? 4 : '50%',
                      background: colors.gradient,
                    }}
                    transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                    style={{
                      position: 'absolute',
                      top: 4, bottom: 4,
                      width: 'calc(50% - 4px)',
                      borderRadius: 12,
                      boxShadow: `0 4px 14px ${colors.primaryGlow}`,
                    }}
                  />

                  {[
                    { type: 'student', icon: UserIcon,    label: 'Student Login' },
                    { type: 'admin',   icon: ShieldCheck, label: 'Admin Login' },
                  ].map(({ type, icon: Icon, label }) => (
                    <motion.button
                      key={type}
                      id={`tab-${type}`}
                      role="tab"
                      aria-selected={loginType === type}
                      type="button"
                      onClick={() => {
                        setLoginType(type);
                        setUsername('');
                        setPassword('');
                        setLoginState('idle');
                      }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        zIndex: 1,
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: loginType === type ? 'white' : textSecondary,
                        transition: 'color 0.25s',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      className="focus-ring"
                    >
                      <Icon size={14} />
                      {label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* ── Login Form ── */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={loginType}
                  id={`${loginType}-login-form`}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Email / Username */}
                  <FloatingInput
                    id={`${loginType}-username`}
                    label={loginType === 'admin' ? 'Admin Username' : 'Email or Username'}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon={loginType === 'admin' ? ShieldCheck : UserIcon}
                    colors={colors}
                    isDark={isDark}
                    autoFocus={true}
                  />

                  {/* Password */}
                  <FloatingInput
                    id={`${loginType}-password`}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    colors={colors}
                    isDark={isDark}
                    rightElement={
                      <motion.button
                        type="button"
                        id="toggle-password-btn"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          border: 'none', background: 'transparent', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 4, borderRadius: 6,
                          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
                        }}
                        className="focus-ring"
                      >
                        <AnimatePresence mode="wait">
                          {showPassword ? (
                            <motion.span key="eyeoff" initial={{ opacity: 0, rotate: -10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 10 }}>
                              <EyeOff size={15} />
                            </motion.span>
                          ) : (
                            <motion.span key="eye" initial={{ opacity: 0, rotate: 10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -10 }}>
                              <Eye size={15} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    }
                  />

                  {/* Remember me & Forgot */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 24,
                    }}
                  >
                    <label
                      id="remember-me-label"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        cursor: 'pointer', userSelect: 'none',
                      }}
                    >
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setRememberMe(!rememberMe)}
                        style={{
                          width: 18, height: 18, borderRadius: 5,
                          border: rememberMe ? 'none' : `1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                          background: rememberMe ? colors.gradient : checkBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                          boxShadow: rememberMe ? `0 4px 10px ${colors.primaryGlow}` : 'none',
                          flexShrink: 0, cursor: 'pointer',
                        }}
                      >
                        <AnimatePresence>
                          {rememberMe && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Check size={11} color="white" strokeWidth={3} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <input
                        type="checkbox"
                        id="remember-me-checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        aria-label="Remember me"
                      />
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: textSecondary }}>Remember me</span>
                    </label>

                    <Link
                      id="forgot-password-link"
                      to="/forgot-password"
                      style={{
                        fontSize: 12.5, fontWeight: 600,
                        color: colors.primary,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.75'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    id={`${loginType}-submit-btn`}
                    type="submit"
                    disabled={isLoading || !username.trim() || !password}
                    whileHover={!isLoading && username.trim() && password ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!isLoading && username.trim() && password ? { scale: 0.97 } : {}}
                    animate={loginState === 'error' ? {
                      x: [0, -8, 8, -6, 6, -4, 4, 0],
                      transition: { duration: 0.5, ease: 'easeInOut' },
                    } : {}}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      borderRadius: 14,
                      border: 'none',
                      background: btnBg,
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: (!isLoading && username.trim() && password) ? 'pointer' : 'not-allowed',
                      opacity: (!username.trim() || !password) ? 0.55 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 24px ${colors.primaryGlow}`,
                      transition: 'background 0.4s ease, box-shadow 0.3s ease, opacity 0.2s',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.01em',
                    }}
                    className="login-btn-shimmer focus-ring"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loginState}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        {btnContent()}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              </AnimatePresence>

              {/* ── Divider ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px',
              }}>
                <div style={{ flex: 1, height: 1, background: dividerColor }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: textSecondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Need help?
                </span>
                <div style={{ flex: 1, height: 1, background: dividerColor }} />
              </div>

              {/* ── Footer ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ textAlign: 'center' }}
              >
                <p style={{ color: textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                  Having trouble?{' '}
                  <motion.a
                    id="contact-helpdesk-link"
                    href="mailto:support@campus.edu"
                    whileHover={{ opacity: 0.75 }}
                    style={{
                      color: colors.primary,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Contact Helpdesk
                  </motion.a>
                </p>
              </motion.div>
            </div>

            {/* Card glow */}
            <div style={{
              position: 'absolute',
              inset: -1,
              borderRadius: 30,
              background: `linear-gradient(135deg, ${colors.orb1}, transparent 60%, ${colors.orb2})`,
              pointerEvents: 'none',
              zIndex: -1,
              filter: 'blur(20px)',
              opacity: 0.6,
            }} />
          </motion.div>
        </div>
      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (min-width: 768px) {
          #left-panel { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Login;