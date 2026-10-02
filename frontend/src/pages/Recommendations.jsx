import React from 'react';
import { CpuIcon, Wrench, Box, UsersRound, Layers } from 'lucide-react';

export const Recommendations = () => {
  const categories = [
    {
      title: 'Machine Preventive Interventions',
      icon: Wrench,
      color: 'indigo',
      actions: [
        'Schedule Immediate Preventive Maintenance & Calibration',
        'Shift Order to Parallel 5-Axis CNC Milling Station',
        'Reduce Machine Load & Micro-stoppage Interval'
      ]
    },
    {
      title: 'Material Supply Chain Interventions',
      icon: Box,
      color: 'amber',
      actions: [
        'Reallocate Raw Stock from Non-Urgent Batch',
        'Expedite Express Supplier Logistics',
        'Adjust Production Batch Sequence'
      ]
    },
    {
      title: 'Workforce & Shift Interventions',
      icon: UsersRound,
      color: 'emerald',
      actions: [
        'Reallocate Senior Tier-1 Operators to Overload Shift',
        'Approve 2-Hour Overtime Allocation',
        'Conduct Micro-Training for Apprentice Technicians'
      ]
    },
    {
      title: 'Workload & Sequence Optimization',
      icon: Layers,
      color: 'purple',
      actions: [
        'Postpone Low-Priority Buffer Orders',
        'Transfer Workload to Off-Peak Shift',
        'Split Order into Two Parallel Sub-Batches'
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Adaptive Preventive Action Engine Library</h1>
        <p className="text-xs text-slate-400">Rule-driven counterfactual recommendation engine for manufacturing delay mitigation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{cat.title}</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                {cat.actions.map((act, aIdx) => (
                  <li key={aIdx} className="flex items-center gap-2 p-2 bg-slate-900/60 rounded border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
