import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogOut, User, Bell } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-slate-900/80 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          Factory Intelligence Platform v1.0
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition">
          <Bell size={18} />
        </button>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User size={16} />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-slate-200">{currentUser?.full_name || 'Production User'}</p>
            <p className="text-[10px] text-slate-400">{currentUser?.role || 'Operator'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs transition font-medium"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
};
