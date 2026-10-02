import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService, predictionService } from '../services/api';
import { RiskBadge, StatusBadge } from '../components/StatusBadge';
import {
  Cpu, AlertTriangle, ShieldCheck, ArrowLeft, Layers, CheckCircle2, Award, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchOrderAndPrediction();
  }, [id]);

  const fetchOrderAndPrediction = async () => {
    setLoading(true);
    try {
      const orderRes = await orderService.getOrder(id);
      setOrder(orderRes.data);
      
      // Auto-run or fetch prediction
      const predRes = await predictionService.predictOrder(orderRes.data.order_id);
      setPrediction(predRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPrediction = async () => {
    if (!order) return;
    setPredicting(true);
    try {
      const res = await predictionService.predictOrder(order.order_id);
      setPrediction(res.data);
    } catch (err) {
      alert('Prediction execution failed.');
    } finally {
      setPredicting(false);
    }
  };

  if (loading || !order) {
    return <div className="p-8 text-center text-slate-400">Loading Order Diagnostic Information...</div>;
  }

  const causeChartData = prediction?.root_cause?.all_causes?.map(c => ({
    name: c.label,
    contribution: c.contribution_pct
  })) || [];

  const recAction = prediction?.recommendations?.recommended_action;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Production Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-mono text-slate-100">{order.order_id}</h1>
            <StatusBadge status={order.status} />
            {prediction && <RiskBadge risk={prediction.risk.risk_category} />}
          </div>
        </div>
        <button
          onClick={handleRunPrediction}
          disabled={predicting}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-indigo-600/30 transition"
        >
          <Cpu size={16} />
          {predicting ? 'Computing Predictions...' : 'Re-Run AI Diagnosis'}
        </button>
      </div>

      {/* Production Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Product Family</p>
          <p className="text-base font-bold text-slate-100 mt-1">{order.product_family}</p>
          <p className="text-[11px] text-slate-400 mt-1">Batch Qty: {order.order_quantity} units</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Planned Duration</p>
          <p className="text-base font-bold text-slate-100 mt-1">{order.planned_duration_days} Days</p>
          <p className="text-[11px] text-slate-400 mt-1">Priority: {order.order_priority}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Machine Status</p>
          <p className="text-base font-bold text-slate-100 mt-1">{order.machine_capacity_utilization}% Util</p>
          <p className="text-[11px] text-rose-400 mt-1">{order.machine_downtime_hours} hrs Downtime</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400">Supply & Staffing</p>
          <p className="text-base font-bold text-slate-100 mt-1">{order.material_availability_pct}% Material</p>
          <p className="text-[11px] text-slate-400 mt-1">{order.workforce_availability_pct}% Staff Available</p>
        </div>
      </div>

      {/* AI Prediction & Dynamic Risk Summary */}
      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction Box */}
          <div className="glass-card p-5 rounded-xl border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">
                ML Classification & Regression
              </span>
              <div className="mt-4">
                <p className="text-xs text-slate-400">Predicted Delay Probability</p>
                <h2 className="text-4xl font-extrabold text-indigo-400 mt-1">
                  {prediction.delay_probability}%
                </h2>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400">Expected Delay Duration</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">
                  {prediction.expected_delay_days} Days
                </h3>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-900/60 rounded-lg text-xs text-slate-300">
              <span className="font-semibold text-indigo-300">Target Outcome: </span>
              {prediction.is_delayed_predicted ? 'HIGH LIKELIHOOD OF DELAY' : 'ON-TIME COMPLETION EXPECTED'}
            </div>
          </div>

          {/* Dynamic Risk Score Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-200">Dynamic Production Risk Score</h3>
                <RiskBadge risk={prediction.risk.risk_category} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-100">{prediction.risk.risk_score}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="space-y-2 mt-4 text-xs">
              <p className="text-[11px] text-slate-400 font-medium uppercase">Risk Factors Breakdown:</p>
              <div className="flex justify-between text-slate-300">
                <span>Probability Weight (35%):</span>
                <span className="font-mono">{prediction.risk.components.probability_weight}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Duration Severity (25%):</span>
                <span className="font-mono">{prediction.risk.components.duration_weight}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Machine Overload Risk (15%):</span>
                <span className="font-mono">{prediction.risk.components.machine_weight}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Material Shortage Risk (15%):</span>
                <span className="font-mono">{prediction.risk.components.material_weight}</span>
              </div>
            </div>
          </div>

          {/* Root Cause Summary */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
                <Layers size={16} className="text-amber-400" />
                SHAP Root Cause Diagnosis
              </h3>
              {prediction.root_cause.primary_cause && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 mb-3">
                  <p className="font-semibold uppercase tracking-wider text-[10px]">Primary Delay Driver:</p>
                  <p className="text-sm font-bold mt-0.5">{prediction.root_cause.primary_cause.label}</p>
                  <p className="text-xs text-amber-400/80 mt-1">
                    Contributes <span className="font-bold">{prediction.root_cause.primary_cause.contribution_pct}%</span> to risk.
                  </p>
                </div>
              )}
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded border border-slate-800">
                "{prediction.root_cause.human_explanation}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SHAP Feature Contribution Bar Chart */}
      {prediction && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">
            SHAP Feature Attribution Breakdown (%)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={causeChartData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={150} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="contribution" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {causeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* RECOMMENDED ACTION BANNER */}
      {recAction && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase rounded tracking-wider flex items-center gap-1">
                  <Award size={12} /> BEST RECOMMENDED PREVENTIVE ACTION
                </span>
                <span className="text-xs text-emerald-400 font-semibold">{recAction.category} Category</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1">{recAction.action_name}</h3>
              <p className="text-xs text-slate-300 max-w-2xl">{recAction.description}</p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30 text-center min-w-[200px]">
              <p className="text-[10px] uppercase text-slate-400">Expected Improvement</p>
              <p className="text-2xl font-black text-emerald-400">+{recAction.improvement_days} Days</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Delay reduced to {recAction.expected_delay_days} days</p>
            </div>
          </div>
        </div>
      )}

      {/* Counterfactual Action Comparison Table */}
      {prediction?.recommendations && (
        <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">
              Candidate Action Counterfactual Impact Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Action Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Expected Delay</th>
                  <th className="p-3">Improvement</th>
                  <th className="p-3">Feasibility</th>
                  <th className="p-3">Cost Level</th>
                  <th className="p-3">Recommendation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {prediction.recommendations.ranked_candidate_actions.map((act) => (
                  <tr key={act.action_id} className={act.is_recommended ? 'bg-emerald-500/10 font-medium' : 'hover:bg-slate-800/40'}>
                    <td className="p-3">
                      <p className="font-semibold text-slate-200">{act.action_name}</p>
                      <p className="text-[10px] text-slate-400">{act.description}</p>
                    </td>
                    <td className="p-3">{act.category}</td>
                    <td className="p-3 font-mono font-bold text-slate-200">{act.expected_delay_days} days</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">+{act.improvement_days} days</td>
                    <td className="p-3">{act.feasibility}</td>
                    <td className="p-3">{act.cost_level}</td>
                    <td className="p-3">
                      {act.is_recommended ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                          RECOMMENDED
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Candidate</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
