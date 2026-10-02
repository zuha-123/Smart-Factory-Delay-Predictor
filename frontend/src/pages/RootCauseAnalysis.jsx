import React from 'react';
import { Layers, AlertCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const RootCauseAnalysis = () => {
  const globalCauses = [
    { cause: 'Machine Overload (>85% Util)', contribution: 41.2, color: '#ef4444' },
    { cause: 'Material Availability Deficit (<80%)', contribution: 27.8, color: '#f59e0b' },
    { cause: 'Machine Downtime & Maintenance Overdue', contribution: 18.5, color: '#6366f1' },
    { cause: 'Workforce Staffing Deficit', contribution: 12.5, color: '#10b981' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Global SHAP Root-Cause Analysis</h1>
        <p className="text-xs text-slate-400">Explainable AI feature attributions across manufacturing operational datasets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Layers size={16} className="text-indigo-400" />
            Global Feature Contribution Ranking (% Share of Production Delay Risk)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalCauses} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 50]} />
                <YAxis dataKey="cause" type="category" stroke="#94a3b8" fontSize={11} width={240} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                  {globalCauses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">Explainable AI Methodology</h3>
          <div className="space-y-3 text-xs text-slate-300">
            <p className="leading-relaxed">
              Our explainability pipeline leverages <span className="font-semibold text-indigo-400">SHAP (SHapley Additive exPlanations)</span> derived from game-theoretic feature attribution.
            </p>
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1">
              <p className="font-semibold text-slate-200">Dominant Factor:</p>
              <p className="text-rose-400 font-bold">Machine Overload (41.2%)</p>
              <p className="text-[11px] text-slate-400">High capacity utilization above 85% creates bottleneck queues.</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1">
              <p className="font-semibold text-slate-200">Secondary Factor:</p>
              <p className="text-amber-400 font-bold">Material Availability (27.8%)</p>
              <p className="text-[11px] text-slate-400">Stock shortages delay batch initiation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
