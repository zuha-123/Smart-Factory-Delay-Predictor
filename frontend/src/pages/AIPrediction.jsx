import React, { useState } from 'react';
import { predictionService } from '../services/api';
import { RiskBadge } from '../components/StatusBadge';
import { Cpu, Play, Award, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AIPrediction = () => {
  const [formData, setFormData] = useState({
    order_id: 'SIM-PROD-101',
    product_family: 'Engine_Gamma',
    order_quantity: 1200,
    planned_duration_days: 5.0,
    order_priority: 'High',
    shift_type: 'Day',
    machine_capacity_utilization: 95.0,
    machine_downtime_hours: 12.0,
    maintenance_overdue_days: 8,
    material_availability_pct: 65.0,
    supplier_delay_days: 3.0,
    workforce_availability_pct: 75.0,
    workforce_skill_index: 0.80,
    active_workload_orders: 12
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictionService.simulatePrediction(formData);
      setResult(res.data);
    } catch (err) {
      alert('Simulation error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Interactive AI Prediction Simulator</h1>
        <p className="text-xs text-slate-400">Simulate custom production parameters and evaluate immediate ML delay probabilities & SHAP root causes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">Production Parameters</h3>
          <form onSubmit={handleSimulate} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Product Line</label>
              <select value={formData.product_family} onChange={e => setFormData({...formData, product_family: e.target.value})} className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200">
                <option value="Assembly_Alpha">Assembly Alpha</option>
                <option value="Component_Beta">Component Beta</option>
                <option value="Engine_Gamma">Engine Gamma</option>
                <option value="Hydraulic_Delta">Hydraulic Delta</option>
                <option value="Precision_Gear">Precision Gear</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Machine Utilization (%) : {formData.machine_capacity_utilization}%</label>
              <input type="range" min="40" max="105" value={formData.machine_capacity_utilization} onChange={e => setFormData({...formData, machine_capacity_utilization: parseFloat(e.target.value)})} className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Machine Downtime (hrs) : {formData.machine_downtime_hours} hrs</label>
              <input type="range" min="0" max="48" step="0.5" value={formData.machine_downtime_hours} onChange={e => setFormData({...formData, machine_downtime_hours: parseFloat(e.target.value)})} className="w-full accent-rose-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Maintenance Overdue (days) : {formData.maintenance_overdue_days} days</label>
              <input type="range" min="0" max="30" value={formData.maintenance_overdue_days} onChange={e => setFormData({...formData, maintenance_overdue_days: parseInt(e.target.value)})} className="w-full accent-amber-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Material Availability (%) : {formData.material_availability_pct}%</label>
              <input type="range" min="30" max="100" value={formData.material_availability_pct} onChange={e => setFormData({...formData, material_availability_pct: parseFloat(e.target.value)})} className="w-full accent-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Workforce Availability (%) : {formData.workforce_availability_pct}%</label>
              <input type="range" min="40" max="100" value={formData.workforce_availability_pct} onChange={e => setFormData({...formData, workforce_availability_pct: parseFloat(e.target.value)})} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Active Line Orders : {formData.active_workload_orders}</label>
              <input type="range" min="1" max="20" value={formData.active_workload_orders} onChange={e => setFormData({...formData, active_workload_orders: parseInt(e.target.value)})} className="w-full accent-purple-500" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Play size={14} />
              {loading ? 'Running ML Inference...' : 'Run Simulation'}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl border border-indigo-500/30">
                  <p className="text-xs text-slate-400">Delay Probability</p>
                  <h2 className="text-3xl font-extrabold text-indigo-400 mt-1">{result.delay_probability}%</h2>
                </div>
                <div className="glass-card p-4 rounded-xl border border-indigo-500/30">
                  <p className="text-xs text-slate-400">Expected Delay</p>
                  <h2 className="text-3xl font-extrabold text-slate-100 mt-1">{result.expected_delay_days} d</h2>
                </div>
                <div className="glass-card p-4 rounded-xl border border-indigo-500/30">
                  <p className="text-xs text-slate-400">Risk Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-3xl font-extrabold text-slate-100">{result.risk.risk_score}</h2>
                    <RiskBadge risk={result.risk.risk_category} />
                  </div>
                </div>
              </div>

              {/* SHAP Causes */}
              <div className="glass-panel p-5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">SHAP Root Cause Breakdown</h3>
                <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded mb-4">
                  "{result.root_cause.human_explanation}"
                </p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.root_cause.all_causes.map(c => ({ name: c.label, pct: c.contribution_pct }))}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                      <Bar dataKey="pct" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Action */}
              {result.recommendations?.recommended_action && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                    Best Recommended Preventive Action
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-2">{result.recommendations.recommended_action.action_name}</h4>
                  <p className="text-xs text-slate-300 mt-1">{result.recommendations.recommended_action.description}</p>
                  <p className="text-xs font-bold text-emerald-400 mt-2">
                    Reduces expected delay by +{result.recommendations.recommended_action.improvement_days} days!
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="glass-panel p-12 rounded-xl text-center text-slate-500 text-xs border border-slate-800">
              <Cpu size={36} className="mx-auto mb-3 text-slate-600" />
              Adjust parameters on the left and click "Run Simulation" to view instant ML predictions & root-cause attributions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
