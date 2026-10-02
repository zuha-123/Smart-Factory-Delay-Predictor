import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Lock, Mail, ShieldAlert, Cpu } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@factory.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/40">
            <Cpu size={26} />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Production Delay AI Platform</h1>
          <p className="text-xs text-slate-400 mt-1">Root-Cause Diagnosis & Adaptive Preventive Actions</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="email@factory.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium text-center mb-2">Quick Demo Preset Sign In:</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              onClick={() => setPreset('admin@factory.com', 'admin123')}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              Admin
            </button>
            <button
              onClick={() => setPreset('manager@factory.com', 'manager123')}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              Prod Manager
            </button>
            <button
              onClick={() => setPreset('analyst@factory.com', 'analyst123')}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              Analyst
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
