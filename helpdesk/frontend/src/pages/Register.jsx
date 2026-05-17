import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Loader2, GraduationCap, UserPlus, User as UserIcon,
  Mail, Lock, Eye, EyeOff, ClipboardList, LineChart, Headset,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = (err) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (data.detail) return data.detail;
      if (typeof data === 'object') {
        const messages = [];
        for (const [key, value] of Object.entries(data)) {
          const msg = Array.isArray(value) ? value[0] : String(value);
          messages.push(`${key}: ${msg}`);
        }
        if (messages.length > 0) return messages[0];
      }
    }
    if (!err.response) return 'Network error. Please check your internet connection.';
    return 'Registration failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Account created! You can now log in.');
      navigate('/login');
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

  const inputClass = "w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl outline-none transition-all border border-slate-200 bg-slate-50/80 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white";

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
        .feat-card:hover { background: rgba(255,255,255,0.07) !important; }
      `}</style>

      <div className="h-screen w-full flex flex-col md:flex-row login-body overflow-hidden">

        {/* Left Panel */}
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
              style={{ background: 'rgba(16,185,129,0.12)', border: '0.5px solid rgba(16,185,129,0.3)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: '#10b981' }}>
                Create Your Account
              </span>
            </div>
            <h1
              className="login-heading font-extrabold text-white leading-tight mb-3"
              style={{ fontSize: '2rem' }}
            >
              Join the<br />
              <span style={{ color: '#10b981' }}>campus support</span><br />
              community.
            </h1>
            <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#94a3b8' }}>
              Register to submit support requests, track resolutions, and stay connected.
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
                <span style={{ color: '#10b981' }}>{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{f.title}</p>
                  <p className="text-[11px]" style={{ color: '#64748b' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto relative" style={{ background: '#ffffff' }}>
          <div
            className="absolute pointer-events-none"
            style={{
              width: 400, height: 400, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
              top: -120, right: -120,
            }}
          />

          <div
            className="relative w-full max-w-[380px] bg-white rounded-3xl p-8"
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
                  background: 'linear-gradient(135deg,#10b981,#34d399)',
                  boxShadow: '0 8px 20px rgba(16,185,129,0.35)',
                }}
              >
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h2 className="login-heading font-extrabold mb-1" style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                Create Account
              </h2>
              <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                Register to start submitting support requests
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="username"
                    required
                    minLength={3}
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Email <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94a3b8' }} />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
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
                    name="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md" style={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94a3b8' }} />
                  <input
                    type="password"
                    name="password_confirm"
                    required
                    autoComplete="new-password"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gradient w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 mt-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs font-medium" style={{ color: '#94a3b8' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold" style={{ color: '#6366f1' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
