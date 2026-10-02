import React, { useEffect, useState } from 'react';
import { machineService } from '../services/api';
import { Wrench, AlertTriangle, Plus } from 'lucide-react';

export const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const res = await machineService.getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Machine Inventory & Status</h1>
          <p className="text-xs text-slate-400">Monitor utilization, downtime hours, and maintenance schedules</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Machine Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Capacity Util</th>
              <th className="p-3">Downtime Hrs</th>
              <th className="p-3">Maintenance Overdue</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {machines.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-indigo-400">{m.machine_code}</td>
                <td className="p-3 font-semibold text-slate-200">{m.name}</td>
                <td className="p-3">{m.category}</td>
                <td className="p-3">{m.capacity_utilization}%</td>
                <td className="p-3 text-rose-400 font-semibold">{m.downtime_hours} hrs</td>
                <td className="p-3">{m.maintenance_overdue_days} days</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${
                    m.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
