import React, { useEffect, useState } from 'react';
import { workforceService } from '../services/api';
import { UsersRound } from 'lucide-react';

export const Workforce = () => {
  const [workforce, setWorkforce] = useState([]);

  useEffect(() => {
    workforceService.getWorkforce().then(res => setWorkforce(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Workforce & Shift Operator Roster</h1>
        <p className="text-xs text-slate-400">Shift staffing levels, skill index tracking, and availability monitoring</p>
      </div>

      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Operator Code</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Shift Type</th>
              <th className="p-3">Availability %</th>
              <th className="p-3">Skill Index</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {workforce.map((w) => (
              <tr key={w.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-blue-400">{w.operator_code}</td>
                <td className="p-3 font-semibold text-slate-200">{w.full_name}</td>
                <td className="p-3">{w.shift_type}</td>
                <td className="p-3">{w.availability_pct}%</td>
                <td className="p-3 font-mono font-bold text-indigo-300">{w.skill_index}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
