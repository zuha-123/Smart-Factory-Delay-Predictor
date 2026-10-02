import React, { useEffect, useState } from 'react';
import { materialService } from '../services/api';
import { Box, AlertTriangle } from 'lucide-react';

export const Materials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    materialService.getMaterials().then(res => setMaterials(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Raw Material Stock & Supply Chain</h1>
        <p className="text-xs text-slate-400">Track stock levels, material availability percentages, and supplier lead times</p>
      </div>

      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Material Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Stock Quantity</th>
              <th className="p-3">Availability %</th>
              <th className="p-3">Supplier Delay</th>
              <th className="p-3">Reorder Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-amber-400">{m.material_code}</td>
                <td className="p-3 font-semibold text-slate-200">{m.name}</td>
                <td className="p-3">{m.stock_quantity} {m.unit}</td>
                <td className="p-3">
                  <span className={m.availability_pct < 70 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {m.availability_pct}%
                  </span>
                </td>
                <td className="p-3">{m.supplier_delay_days} days</td>
                <td className="p-3">{m.reorder_level} {m.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
