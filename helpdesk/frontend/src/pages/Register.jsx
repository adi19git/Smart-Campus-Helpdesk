import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Hexagon, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Registration page — allows new students to create an account.
 * Matches the Login page design with glassmorphism styling.
 */
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Extract a user-friendly error message from an Axios error response.
   */
  const getErrorMessage = (err) => {
    if (err.response?.data) {
      const data = err.response.data;

      if (data.detail) return data.detail;

      // DRF validation errors: { field: ["error msg"] }
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

    // Client-side validation
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 aurora-bg relative overflow-hidden">
      
      {/* Decorative blurred circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-float" style={{ animationDelay: '3s' }} />

      {/* Glass Card */}
      <div className="glass-card w-full max-w-[420px] rounded-[2rem] p-8 sm:p-10 relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/40 mb-5 shadow-inner">
            <Hexagon className="w-8 h-8 text-emerald-600 fill-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-600 text-center font-medium">
            Register to start submitting support requests
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="animate-fade-in-up-delay-1">
            <label htmlFor="reg-username" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              name="username"
              required
              autoComplete="username"
              minLength={3}
              value={formData.username}
              onChange={handleChange}
              className="glow-input appearance-none block w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-400 sm:text-sm transition-all duration-300"
              placeholder="Choose a username"
            />
          </div>

          <div className="animate-fade-in-up-delay-1">
            <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Email <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="glow-input appearance-none block w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-400 sm:text-sm transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>

          <div className="animate-fade-in-up-delay-2">
            <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              className="glow-input appearance-none block w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-400 sm:text-sm transition-all duration-300"
              placeholder="Min 8 characters"
            />
          </div>

          <div className="animate-fade-in-up-delay-2">
            <label htmlFor="reg-password-confirm" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Confirm Password
            </label>
            <input
              id="reg-password-confirm"
              type="password"
              name="password_confirm"
              required
              autoComplete="new-password"
              value={formData.password_confirm}
              onChange={handleChange}
              className="glow-input appearance-none block w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-400 sm:text-sm transition-all duration-300"
              placeholder="Repeat your password"
            />
          </div>

          <div className="animate-fade-in-up-delay-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="shimmer-button w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600 animate-fade-in-up-delay-3">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-700 hover:text-blue-800 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
