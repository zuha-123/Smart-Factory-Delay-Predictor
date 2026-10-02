import React from 'react';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Analytics = () => {
  const oeeData = [
    { shift: 'Shift 1', availability: 92, performance: 88, quality: 99, oee: 80.2 },
    { shift: 'Shift 2', availability: 85, performance: 82, quality: 97, oee: 67.6 },
    { shift: 'Shift 3', availability: 78, performance: 79, quality: 96, oee: 59.1 },
    { shift: 'Shift 4', availability: 94, performance: 91, quality: 98, oee: 83.8 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Factory Operational Analytics & OEE</h1>
        <p className="text-xs text-slate-400">Overall Equipment Effectiveness (OEE), Availability, Performance & Quality tracking</p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Shift-Wise OEE Performance (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={oeeData}>
              <XAxis dataKey="shift" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              <Area type="monotone" dataKey="oee" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="OEE %" />
              <Area type="monotone" dataKey="availability" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} name="Availability %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
