import React, { useState } from 'react';
import { GitCompare, Award, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ActionComparison = () => {
  const [baselineDelay, setBaselineDelay] = useState(4.5);

  const actions = [
    { name: 'No Intervention (Baseline)', delay: baselineDelay, imp: 0, color: '#ef4444' },
    { name: 'Schedule Maintenance', delay: 1.2, imp: (baselineDelay - 1.2).toFixed(1), color: '#10b981' },
    { name: 'Expedite Raw Material', delay: 2.1, imp: (baselineDelay - 2.1).toFixed(1), color: '#3b82f6' },
    { name: 'Reallocate Senior Staff', delay: 2.8, imp: (baselineDelay - 2.8).toFixed(1), color: '#f59e0b' },
    { name: 'Rebalance Workload', delay: 1.8, imp: (baselineDelay - 1.8).toFixed(1), color: '#a855f7' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Counterfactual Action Impact Comparator</h1>
        <p className="text-xs text-slate-400">Side-by-side expected delay reduction comparison under candidate interventions</p>
      </div>

      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-xs">
        <span className="text-slate-300 font-semibold">Simulated Baseline Delay:</span>
        <input
          type="range"
          min="1.0"
          max="10.0"
          step="0.5"
          value={baselineDelay}
          onChange={(e) => setBaselineDelay(parseFloat(e.target.value))}
          className="w-48 accent-indigo-500"
        />
        <span className="font-mono font-bold text-indigo-400">{baselineDelay} Days</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">
            Expected Delay Duration After Intervention (Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actions}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="delay" radius={[4, 4, 0, 0]}>
                  {actions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="glass-card p-5 rounded-xl border border-emerald-500/40 flex flex-col justify-between">
          <div>
            <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase rounded">
              OPTIMAL ACTION
            </span>
            <h3 className="text-base font-bold text-slate-100 mt-2">Schedule Maintenance</h3>
            <p className="text-xs text-slate-300 mt-2">
              Yields highest delay reduction of <span className="text-emerald-400 font-bold">{(baselineDelay - 1.2).toFixed(1)} Days</span>.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
            Baseline: {baselineDelay} d → New: 1.2 d
          </div>
        </div>
      </div>
    </div>
  );
};
