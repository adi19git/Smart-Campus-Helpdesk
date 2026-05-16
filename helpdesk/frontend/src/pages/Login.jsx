import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Loader2, GraduationCap, ClipboardList, LineChart,
  Headset, User as UserIcon, ShieldCheck, Lock, Eye, EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [loginType, setLoginType] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      if (err.response.status === 401) return 'Invalid username or password.';
      if (err.response.status === 429) return 'Too many attempts. Please wait and try again.';
      if (err.response.status >= 500) return 'Server error. Please try again later.';
    }
    if (err.code === 'ECONNABORTED') return 'Request timed out. Check your connection.';
    if (!err.response) return 'Network error. Please check your internet connection.';
    return 'Login failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <ClipboardList className="w-4 h-4" />, title: 'Easy Reporting', desc: 'Submit issues in just a few steps.' },
    { icon: <LineChart className="w-4 h-4" />, title: 'Track Progress', desc: 'Monitor your requests in real time.' },
    { icon: <Headset className="w-4 h-4" />, title: 'Expert Support', desc: 'Get help from campus staff quickly.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .login-heading { font-family: 'Bricolage Grotesque', sans-serif; }
        .login-body    { font-family: 'DM Sans', sans-serif; }
        .btn-gradient  {
          background: linear-gradient(135deg, #6366f1, #818cf8);
          box-shadow: 0 4px 14px rgba(99,102,241,0.4);
          transition: all 0.2s;
        }
        .btn-gradient:hover { background: linear-gradient(135deg, #4f46e5, #6366f1); }
        .aurora-bg {
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(56,189,248,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(99,102,241,0.22) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%);
        }
        .grid-texture {
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .login-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important;
          background: #fff !important;
        }
        .feat-card:hover { background: rgba(255,255,255,0.07) !important; }
      `}</style>

      <div className="h-screen w-full flex flex-col md:flex-row login-body overflow-hidden">

        {/* ── Left Panel ── */}
        <div
          className="hidden md:flex md:w-[46%] lg:w-[48%] flex-col justify-between p-8 relative overflow-hidden"
          style={{ background: '#0f172a' }}
        >
          <div className="aurora-bg absolute inset-0 pointer-events-none" />
          <div className="grid-texture absolute inset-0 pointer-events-none opacity-[0.06]" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#38bdf8,#6366f1)' }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="login-heading font-bold text-sm leading-tight text-white">
              Smart Campus<br /><span style={{ color: '#38bdf8' }}>Helpdesk</span>
            </span>
          </div>

          {/* Hero */}
          <div className="relative flex-1 flex flex-col justify-center py-8">
            <div
              className="inline-flex items-center gap-2 mb-4 w-fit px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(56,189,248,0.12)', border: '0.5px solid rgba(56,189,248,0.3)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#38bdf8' }} />
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: '#38bdf8' }}>
                Campus Platform v2.0
              </span>
            </div>
            <h1
              className="login-heading font-extrabold text-white leading-tight mb-3"
              style={{ fontSize: '2rem' }}
            >
              Here to help,<br />
              <span style={{ color: '#38bdf8' }}>every step</span><br />
              of the way.
            </h1>
            <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#94a3b8' }}>
              Report issues, track requests, and connect with campus support — all in one place.
            </p>
          </div>

          {/* Features */}
          <div className="relative flex flex-col gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="feat-card flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}
              >
                <span style={{ color: '#38bdf8' }}>{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{f.title}</p>
                  <p className="text-[11px]" style={{ color: '#64748b' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto relative" style={{ background: '#ffffff' }}>
          <div
            className="absolute pointer-events-none"
            style={{
              width: 400, height: 400, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
              top: -120, right: -120,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
              bottom: -80, left: -80,
            }}
          />

          <div
            className="relative w-full max-w-[340px] bg-white rounded-3xl p-8"
            style={{
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 40px -8px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                  boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
                }}
              >
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h2 className="login-heading font-extrabold mb-1" style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                Welcome Back
              </h2>
              <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                Sign in to access your dashboard
              </p>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
              <span className="text-[9.5px] font-bold tracking-widest uppercase" style={{ color: '#cbd5e1' }}>
                Sign in as
              </span>
              <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Tabs */}
              <div
                className="flex gap-1 p-1 rounded-xl"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                {['student', 'admin'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLoginType(type)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-[9px] transition-all"
                    style={
                      loginType === type
                        ? { background: '#fff', color: '#6366f1', border: '0.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                        : { color: '#94a3b8', border: 'none', background: 'transparent' }
                    }
                  >
                    {type === 'student' ? <UserIcon className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={loginType === 'admin' ? 'e.g. admin' : 'e.g. student'}
                    className="login-input w-full pl-9 pr-4 py-2.5 text-sm font-medium rounded-xl outline-none transition-all"
                    style={{ border: '1px solid #e2e8f0', background: '#fafafa', color: '#0f172a' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94a3b8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="login-input w-full pl-9 pr-10 py-2.5 text-sm font-medium rounded-xl outline-none transition-all tracking-widest"
                    style={{ border: '1px solid #e2e8f0', background: '#fafafa', color: '#0f172a' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                    style={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded cursor-pointer"
                    style={{ accentColor: '#6366f1' }}
                  />
                  <span className="text-xs font-medium" style={{ color: '#64748b' }}>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold" style={{ color: '#6366f1' }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gradient w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-1">
                <div className="w-4 h-0.5 rounded-full" style={{ background: '#6366f1' }} />
                <div className="w-4 h-0.5 rounded-full" style={{ background: '#e2e8f0' }} />
                <div className="w-4 h-0.5 rounded-full" style={{ background: '#e2e8f0' }} />
              </div>
              <p className="text-xs" style={{ color: '#94a3b8' }}>
                Need help?{' '}
                <a href="mailto:support@campus.edu" className="font-semibold" style={{ color: '#6366f1' }}>
                  Contact helpdesk
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;