import React from 'react';

export const RiskBadge = ({ risk }) => {
  const styles = {
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    CRITICAL: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse',
  };

  const style = styles[risk] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style}`}>
      {risk || 'N/A'}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    'Scheduled': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'In Progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Delayed': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const style = styles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${style}`}>
      {status || 'Unknown'}
    </span>
  );
};
