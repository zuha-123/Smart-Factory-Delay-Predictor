import React from 'react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
  };

  const bgStyle = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br ${bgStyle} border glass-card relative overflow-hidden`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/50">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};
