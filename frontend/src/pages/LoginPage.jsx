import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'CUSTOMER') { setEmail('customer@smartcart.com'); setPassword('customer123'); }
    if (selectedRole === 'STAFF') { setEmail('staff@smartcart.com'); setPassword('staff123'); }
    if (selectedRole === 'MANAGER') { setEmail('manager@smartcart.com'); setPassword('manager123'); }
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);
    
    if (result.success) {
      if (result.user.role === 'CUSTOMER') navigate('/customer');
      else if (result.user.role === 'STAFF') navigate('/staff');
      else if (result.user.role === 'MANAGER') navigate('/manager');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden text-slate-200 font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Left Side Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative z-10 p-12 border-r border-white/10">
        <div className="max-w-md text-center">
          <div className="mb-10 relative inline-block">
            <div className="absolute inset-0 bg-brand-500/40 blur-[40px] rounded-full"></div>
            <ShoppingCart className="w-28 h-28 mx-auto text-brand-400 relative z-10 drop-shadow-[0_0_15px_rgba(0,255,157,0.8)]" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 text-white tracking-tight neon-text">SmartCart</h1>
          <p className="text-slate-400 text-xl leading-relaxed">The future of retail management. Seamless, AI-powered, and instantly rewarding.</p>
        </div>
      </div>

      {/* Right Side Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full glass-panel p-10 rounded-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
            <p className="text-slate-400 mt-2">Sign in to your portal</p>
          </div>

          <div className="flex bg-slate-900/60 border border-white/5 p-1.5 rounded-xl mb-8">
            {['CUSTOMER', 'STAFF', 'MANAGER'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${role === r ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 shadow-[0_0_15px_rgba(0,255,157,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              >
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input 
                type="email" 
                required
                className="w-full glass-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full glass-input pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-3 text-slate-500 hover:text-brand-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
                <input type="checkbox" className="mr-2 rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-brand-500/50" />
                Remember me
              </label>
              <a href="#" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Forgot Password?</a>
            </div>

            <button type="submit" className="w-full btn btn-primary py-3.5 text-lg mt-8">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
