import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, GraduationCap, ClipboardList, LineChart, Headset, User as UserIcon, Shield, Lock, Eye, EyeOff } from 'lucide-react';
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

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      
      {/* Left Panel - Branding (Dark Blue Gradient) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] flex-col justify-between p-12 lg:p-16 relative overflow-hidden text-white">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16 animate-fade-in-up">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-blue-700" />
            </div>
            <h1 className="text-2xl font-bold leading-tight">Smart Campus<br/>Helpdesk</h1>
          </div>

          {/* Hero Copy */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-[1.1]">
              Here to help,<br/>every step of the way.
            </h2>
            <p className="text-blue-100 text-lg mb-12 max-w-sm">
              Report issues, track requests, and get help faster.
            </p>

            {/* Feature List */}
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <ClipboardList className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Easy Reporting</h3>
                  <p className="text-sm text-blue-200/80 leading-relaxed">Submit issues in<br/>just a few steps.</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <LineChart className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Track Progress</h3>
                  <p className="text-sm text-blue-200/80 leading-relaxed">Stay updated with real-time<br/>status tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Headset className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Better Support</h3>
                  <p className="text-sm text-blue-200/80 leading-relaxed">We're here to help you<br/>on campus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Campus Skyline Illustration */}
        <div className="relative z-10 w-full h-32 mt-12 opacity-30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute bottom-0 w-full h-px bg-white/50"></div>
          {/* Building 1 */}
          <div className="absolute bottom-0 left-[5%] w-[15%] h-[60%] border border-b-0 border-white/50 rounded-t-sm flex flex-col justify-evenly items-center py-2">
            <div className="flex gap-2"><div className="w-1 h-2 border border-white/50"></div><div className="w-1 h-2 border border-white/50"></div></div>
            <div className="flex gap-2"><div className="w-1 h-2 border border-white/50"></div><div className="w-1 h-2 border border-white/50"></div></div>
          </div>
          {/* Main Tower */}
          <div className="absolute bottom-0 left-[25%] w-[25%] h-[90%] border border-b-0 border-white/50 rounded-t-md flex flex-col items-center">
             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-white/50 absolute -top-[15px]"></div>
             <div className="w-[10%] h-4 border-l border-r border-white/50 absolute -top-[20px]"></div>
             <div className="w-6 h-6 rounded-full border border-white/50 mt-4 flex items-center justify-center">
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
             </div>
             <div className="grid grid-cols-3 gap-2 mt-4 px-2 w-full">
               <div className="h-3 border border-white/50"></div><div className="h-3 border border-white/50"></div><div className="h-3 border border-white/50"></div>
               <div className="h-3 border border-white/50"></div><div className="h-3 border border-white/50"></div><div className="h-3 border border-white/50"></div>
             </div>
             <div className="absolute bottom-0 w-6 h-8 border border-b-0 border-white/50 rounded-t-sm"></div>
          </div>
          {/* Building 3 */}
          <div className="absolute bottom-0 right-[25%] w-[20%] h-[70%] border border-b-0 border-white/50 rounded-t-sm">
             <div className="grid grid-cols-2 gap-2 mt-4 px-2 w-full">
               <div className="h-3 border border-white/50"></div><div className="h-3 border border-white/50"></div>
               <div className="h-3 border border-white/50"></div><div className="h-3 border border-white/50"></div>
             </div>
          </div>
          {/* Trees */}
          <div className="absolute bottom-0 left-[80%] w-3 h-8 border-l border-white/50">
             <div className="absolute -top-4 -left-3 w-6 h-6 rounded-full border border-white/50"></div>
          </div>
          <div className="absolute bottom-0 right-[5%] w-3 h-6 border-l border-white/50">
             <div className="absolute -top-3 -left-2 w-4 h-4 rounded-full border border-white/50"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form (White/Light) */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* The Card */}
        <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm mb-6">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Sign in to access your dashboard</p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Sign in as</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Toggle Tabs */}
            <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setLoginType('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  loginType === 'student' 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  loginType === 'admin' 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm font-medium shadow-sm"
                    placeholder={loginType === 'admin' ? 'e.g. admin' : 'e.g. student'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm font-medium shadow-sm tracking-widest"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none rounded-md"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-bold text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            Need help? <a href="mailto:support@campus.edu" className="font-bold text-blue-600 hover:text-blue-700">Contact helpdesk</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
