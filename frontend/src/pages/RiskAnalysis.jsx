import React from 'react';
import { ShieldAlert, CheckCircle, Sliders } from 'lucide-react';

export const RiskAnalysis = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Dynamic Risk Score Engine & Matrix</h1>
        <p className="text-xs text-slate-400">Multi-factor production delay risk scoring methodology and configurable thresholds</p>
      </div>

      {/* Threshold Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">LOW RISK</p>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">0 — 25 Score</h2>
          <p className="text-xs text-slate-400 mt-2">Normal operational parameters. Minimal delay likelihood (&lt;25%).</p>
        </div>
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">MEDIUM RISK</p>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">26 — 50 Score</h2>
          <p className="text-xs text-slate-400 mt-2">Minor bottleneck detected. Schedule review recommended.</p>
        </div>
        <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">HIGH RISK</p>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">51 — 75 Score</h2>
          <p className="text-xs text-slate-400 mt-2">Significant delay expected (&gt;2.5 days). Immediate intervention required.</p>
        </div>
        <div className="p-5 rounded-xl bg-purple-500/20 border border-purple-500/40">
          <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">CRITICAL RISK</p>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">76 — 100 Score</h2>
          <p className="text-xs text-slate-400 mt-2">Severe operational crisis. Immediate line rebalancing mandated.</p>
        </div>
      </div>

      {/* Formula & Weighting */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sliders size={16} className="text-indigo-400" />
          Transparent Risk Formula & Factor Weights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-indigo-400 font-bold">35% Weight</span>
            <p className="text-slate-200 font-semibold mt-1">Delay Probability</p>
            <p className="text-[10px] text-slate-400 mt-0.5">XGBoost classifier probability output</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-indigo-400 font-bold">25% Weight</span>
            <p className="text-slate-200 font-semibold mt-1">Expected Duration</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Gradient Boosting regressor days</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-indigo-400 font-bold">15% Weight</span>
            <p className="text-slate-200 font-semibold mt-1">Machine Overload</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Capacity util & downtime hours</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-indigo-400 font-bold">15% Weight</span>
            <p className="text-slate-200 font-semibold mt-1">Material Deficit</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Stock availability % & supplier lead</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-indigo-400 font-bold">10% Weight</span>
            <p className="text-slate-200 font-semibold mt-1">Workforce Deficit</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Operator staffing & active load</p>
          </div>
        </div>
      </div>
    </div>
  );
};
