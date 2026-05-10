import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Hexagon, ShieldCheck, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [loginType, setLoginType] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (err) {
      toast.error('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google login is not configured for this demo.', {
      icon: 'ℹ️',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 aurora-bg relative overflow-hidden">
      
      {/* Decorative blurred circles behind the glass */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-float" style={{ animationDelay: '3s' }} />

      {/* The Glass Card */}
      <div className="glass-card w-full max-w-[420px] rounded-[2rem] p-8 sm:p-10 relative z-10 animate-fade-in-up">
        
        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/40 mb-5 shadow-inner">
            <Hexagon className="w-8 h-8 text-blue-600 fill-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600 text-center font-medium">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Social Login */}
        <div className="animate-fade-in-up-delay-1">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-white/60 hover:bg-white/80 border border-white/50 backdrop-blur-sm rounded-xl shadow-sm text-sm font-semibold text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6 mb-6 animate-fade-in-up-delay-1">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-slate-500 font-medium tracking-wide text-xs uppercase">Or sign in with username</span>
            </div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Animated Tabs */}
          <div className="relative flex bg-white/40 backdrop-blur-md p-1 rounded-xl mb-6 shadow-inner border border-white/30 animate-fade-in-up-delay-1">
            {/* Sliding Pill */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow transition-transform duration-300 ease-in-out ${loginType === 'admin' ? 'translate-x-full left-1' : 'left-1'}`}
            />
            
            <button
              type="button"
              onClick={() => setLoginType('student')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${loginType === 'student' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <UserIcon className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${loginType === 'admin' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          <div className="animate-fade-in-up-delay-2">
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              {loginType === 'admin' ? 'Admin Username' : 'Student Username'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glow-input appearance-none block w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-400 sm:text-sm transition-all duration-300"
              placeholder={loginType === 'admin' ? 'e.g. admin' : 'e.g. student'}
            />
          </div>

          <div className="animate-fade-in-up-delay-2">
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glow-input appearance-none block w-full px-4 py-3 bg-white/60 border border-white/50 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-400 sm:text-sm transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between animate-fade-in-up-delay-3">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/50 rounded cursor-pointer transition-colors bg-white/60"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-700 cursor-pointer select-none">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div className="animate-fade-in-up-delay-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="shimmer-button w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign in to your account'
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600 animate-fade-in-up-delay-3">
          Don't have an account?{' '}
          <a href="#" className="font-bold text-blue-700 hover:text-blue-800 transition-colors">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
