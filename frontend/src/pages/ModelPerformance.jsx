import React, { useEffect, useState } from 'react';
import { modelService } from '../services/api';
import { Sliders, RefreshCw, Award, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ModelPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    try {
      const res = await modelService.getModelPerformance();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const res = await modelService.retrainModels();
      setData(res.data.summary);
      alert('ML models retrained successfully!');
    } catch (err) {
      alert('Retraining failed: ' + err.message);
    } finally {
      setRetraining(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Loading ML Model Metrics & Evaluation Comparison...</div>;
  }

  const clsMetrics = data.classification_metrics || {};
  const regMetrics = data.regression_metrics || {};

  const featureImportanceList = Object.entries(data.feature_importances || {}).map(([key, val]) => ({
    name: key,
    importance: val
  })).sort((a, b) => b.importance - a.importance);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Machine Learning Model Performance Hub</h1>
          <p className="text-xs text-slate-400">Empirical validation metrics for classification & regression model architectures</p>
        </div>
        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-indigo-600/30 transition"
        >
          <RefreshCw size={14} className={retraining ? 'animate-spin' : ''} />
          {retraining ? 'Retraining Pipeline...' : 'Re-Train & Evaluate Models'}
        </button>
      </div>

      {/* Best Model Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-950/40 border border-indigo-500/30">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase">
            <Award size={16} /> Best Classification Model
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">{data.best_classifier}</h2>
          <p className="text-xs text-slate-300 mt-1">
            F1-Score: <span className="font-bold text-indigo-400">{clsMetrics[data.best_classifier]?.f1_score}</span> | ROC-AUC: <span className="font-bold text-indigo-400">{clsMetrics[data.best_classifier]?.roc_auc}</span>
          </p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/40 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <Award size={16} /> Best Regression Model
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">{data.best_regressor}</h2>
          <p className="text-xs text-slate-300 mt-1">
            R² Score: <span className="font-bold text-emerald-400">{regMetrics[data.best_regressor]?.r2_score}</span> | MAE: <span className="font-bold text-emerald-400">{regMetrics[data.best_regressor]?.mae}</span>
          </p>
        </div>
      </div>

      {/* Classification Comparison Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200">Classification Model Comparison (ON-TIME vs DELAYED)</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Model Architecture</th>
              <th className="p-3">Accuracy</th>
              <th className="p-3">Precision</th>
              <th className="p-3">Recall</th>
              <th className="p-3">F1-Score</th>
              <th className="p-3">ROC-AUC</th>
              <th className="p-3">Selection Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {Object.entries(clsMetrics).map(([name, m]) => (
              <tr key={name} className={name === data.best_classifier ? 'bg-indigo-500/10 font-medium' : 'hover:bg-slate-800/40'}>
                <td className="p-3 font-semibold text-slate-200">{name}</td>
                <td className="p-3 font-mono">{m.accuracy}</td>
                <td className="p-3 font-mono">{m.precision}</td>
                <td className="p-3 font-mono">{m.recall}</td>
                <td className="p-3 font-mono font-bold text-indigo-400">{m.f1_score}</td>
                <td className="p-3 font-mono">{m.roc_auc}</td>
                <td className="p-3">
                  {name === data.best_classifier ? (
                    <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                      ACTIVE CLASSIFIER
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Evaluated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regression Comparison Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200">Regression Model Comparison (Expected Delay Duration)</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Model Architecture</th>
              <th className="p-3">MAE (Days)</th>
              <th className="p-3">RMSE (Days)</th>
              <th className="p-3">R² Score</th>
              <th className="p-3">Selection Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {Object.entries(regMetrics).map(([name, m]) => (
              <tr key={name} className={name === data.best_regressor ? 'bg-emerald-500/10 font-medium' : 'hover:bg-slate-800/40'}>
                <td className="p-3 font-semibold text-slate-200">{name}</td>
                <td className="p-3 font-mono">{m.mae}</td>
                <td className="p-3 font-mono">{m.rmse}</td>
                <td className="p-3 font-mono font-bold text-emerald-400">{m.r2_score}</td>
                <td className="p-3">
                  {name === data.best_regressor ? (
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      ACTIVE REGRESSOR
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Evaluated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature Importance Chart */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">
          XGBoost Classifier Feature Importance Weights
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportanceList.slice(0, 8)}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
              <Bar dataKey="importance" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
