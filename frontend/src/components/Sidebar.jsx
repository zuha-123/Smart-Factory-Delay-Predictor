import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Cpu, Layers, Users, Upload, Activity,
  Sliders, ShieldAlert, CpuIcon, GitCompare, UserCheck, Wrench, Box, UsersRound
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Production Orders', path: '/orders', icon: Package },
    { label: 'AI Prediction', path: '/predict', icon: Cpu },
    { label: 'Root Cause Analysis', path: '/root-cause', icon: Layers },
    { label: 'Risk Analysis', path: '/risk-analysis', icon: ShieldAlert },
    { label: 'Recommendations', path: '/recommendations', icon: CpuIcon },
    { label: 'Action Comparison', path: '/action-comparison', icon: GitCompare },
    { label: 'Machines', path: '/machines', icon: Wrench },
    { label: 'Materials', path: '/materials', icon: Box },
    { label: 'Workforce', path: '/workforce', icon: UsersRound },
    { label: 'Dataset Upload', path: '/upload', icon: Upload },
    { label: 'Analytics', path: '/analytics', icon: Activity },
    { label: 'Model Performance', path: '/models', icon: Sliders },
    { label: 'User Management', path: '/users', icon: UserCheck },
    { label: 'Settings', path: '/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
          AI
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-100 tracking-wide">PROD-DELAY AI</h1>
          <p className="text-[10px] text-slate-400 font-mono">ROOT-CAUSE & ACTION ENGINE</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 text-center">
        B.Tech CS Final Year Project
      </div>
    </aside>
  );
};
