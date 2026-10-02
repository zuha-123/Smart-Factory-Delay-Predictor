import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Cpu } from 'lucide-react';

export const ProductionOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Order State
  const [newOrder, setNewOrder] = useState({
    order_id: `ORD-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
    product_family: 'Assembly_Alpha',
    order_quantity: 500,
    planned_duration_days: 5.0,
    order_priority: 'Medium',
    shift_type: 'Day',
    machine_capacity_utilization: 85.0,
    machine_downtime_hours: 2.0,
    maintenance_overdue_days: 1,
    material_availability_pct: 90.0,
    supplier_delay_days: 0.0,
    workforce_availability_pct: 90.0,
    workforce_skill_index: 0.85,
    active_workload_orders: 6
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await orderService.getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await orderService.createOrder(newOrder);
      setShowModal(false);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create order');
    }
  };

  const filtered = orders.filter(o =>
    o.order_id.toLowerCase().includes(search.toLowerCase()) ||
    o.product_family.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Production Orders Directory</h1>
          <p className="text-xs text-slate-400">Manage manufacturing orders and trigger AI predictions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition shadow-lg shadow-indigo-600/30"
        >
          <Plus size={16} />
          Create Production Order
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by Order ID or Product Family..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Product Family</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Planned Days</th>
                <th className="p-3">Machine Util</th>
                <th className="p-3">Downtime</th>
                <th className="p-3">Material %</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-semibold text-indigo-400">{o.order_id}</td>
                  <td className="p-3">{o.product_family}</td>
                  <td className="p-3">{o.order_quantity}</td>
                  <td className="p-3">{o.planned_duration_days} d</td>
                  <td className="p-3">{o.machine_capacity_utilization}%</td>
                  <td className="p-3">{o.machine_downtime_hours} hrs</td>
                  <td className="p-3">{o.material_availability_pct}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                      {o.order_priority}
                    </span>
                  </td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/orders/${o.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 rounded text-xs transition"
                    >
                      <Cpu size={12} />
                      Diagnose & Recommend
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100">Create New Production Order</h2>
            <form onSubmit={handleCreateOrder} className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Order ID</label>
                <input type="text" value={newOrder.order_id} onChange={e => setNewOrder({...newOrder, order_id: e.target.value})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Product Family</label>
                <select value={newOrder.product_family} onChange={e => setNewOrder({...newOrder, product_family: e.target.value})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200">
                  <option value="Assembly_Alpha">Assembly Alpha</option>
                  <option value="Component_Beta">Component Beta</option>
                  <option value="Engine_Gamma">Engine Gamma</option>
                  <option value="Hydraulic_Delta">Hydraulic Delta</option>
                  <option value="Precision_Gear">Precision Gear</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Quantity</label>
                <input type="number" value={newOrder.order_quantity} onChange={e => setNewOrder({...newOrder, order_quantity: parseInt(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Planned Days</label>
                <input type="number" step="0.5" value={newOrder.planned_duration_days} onChange={e => setNewOrder({...newOrder, planned_duration_days: parseFloat(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Machine Utilization %</label>
                <input type="number" step="0.5" value={newOrder.machine_capacity_utilization} onChange={e => setNewOrder({...newOrder, machine_capacity_utilization: parseFloat(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Machine Downtime (hrs)</label>
                <input type="number" step="0.5" value={newOrder.machine_downtime_hours} onChange={e => setNewOrder({...newOrder, machine_downtime_hours: parseFloat(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Material Availability %</label>
                <input type="number" step="0.5" value={newOrder.material_availability_pct} onChange={e => setNewOrder({...newOrder, material_availability_pct: parseFloat(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Workforce Availability %</label>
                <input type="number" step="0.5" value={newOrder.workforce_availability_pct} onChange={e => setNewOrder({...newOrder, workforce_availability_pct: parseFloat(e.target.value)})} className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-200" required />
              </div>

              <div className="col-span-2 flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">Save Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
