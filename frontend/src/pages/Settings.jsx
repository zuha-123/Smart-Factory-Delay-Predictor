import React, { useState } from 'react';
import { Sliders, Save, ShieldCheck } from 'lucide-react';

export const Settings = () => {
  const [lowThresh, setLowThresh] = useState(25);
  const [medThresh, setMedThresh] = useState(50);
  const [highThresh, setHighThresh] = useState(75);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Risk score thresholds successfully updated!');
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-100">System Configuration & Thresholds</h1>
        <p className="text-xs text-slate-400">Configure risk categories, model parameters, and platform settings</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
          Configurable Risk Category Thresholds (0–100 Score)
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">LOW Risk Ceiling: 0 to {lowThresh}</label>
            <input
              type="range"
              min="15"
              max="35"
              value={lowThresh}
              onChange={(e) => setLowThresh(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">MEDIUM Risk Ceiling: {lowThresh + 1} to {medThresh}</label>
            <input
              type="range"
              min="36"
              max="60"
              value={medThresh}
              onChange={(e) => setMedThresh(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">HIGH Risk Ceiling: {medThresh + 1} to {highThresh}</label>
            <input
              type="range"
              min="61"
              max="85"
              value={highThresh}
              onChange={(e) => setHighThresh(parseInt(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300">
            CRITICAL Risk Threshold: Scores from <span className="font-bold">{highThresh + 1} to 100</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/30 transition"
          >
            <Save size={14} />
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};
