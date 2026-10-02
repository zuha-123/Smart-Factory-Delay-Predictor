import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { RiskBadge, StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import {
  Package, AlertTriangle, ShieldAlert, Clock, Activity, CheckCircle, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load dashboard orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filterPriority === 'ALL'
    ? orders
    : orders.filter(o => o.order_priority === filterPriority);

  const totalOrders = orders.length;
  const criticalCount = orders.filter(o => o.order_id.includes('CRIT') || o.machine_downtime_hours > 20).length;
  const highRiskCount = orders.filter(o => o.order_id.includes('HIGH') || o.machine_capacity_utilization > 90).length;
  const scheduledCount = orders.filter(o => o.status === 'Scheduled').length;
  const avgDuration = totalOrders ? (orders.reduce((acc, o) => acc + o.planned_duration_days, 0) / totalOrders).toFixed(1) : 0;

  // Chart Data
  const trendData = orders.map((o, idx) => ({
    name: o.order_id,
    utilization: o.machine_capacity_utilization,
    downtime: o.machine_downtime_hours,
    material: o.material_availability_pct
  }));

  const pieData = [
    { name: 'LOW', value: orders.filter(o => o.order_id.includes('LOW')).length || 1, color: '#10b981' },
    { name: 'MEDIUM', value: orders.filter(o => o.order_id.includes('MED')).length || 2, color: '#f59e0b' },
    { name: 'HIGH', value: highRiskCount || 2, color: '#ef4444' },
    { name: 'CRITICAL', value: criticalCount || 1, color: '#a855f7' },
  ];

  const rootCauseChartData = [
    { cause: 'Machine Overload', count: 42, color: '#6366f1' },
    { cause: 'Material Shortage', count: 28, color: '#f59e0b' },
    { cause: 'Workforce Shortage', count: 18, color: '#ef4444' },
    { cause: 'Workload Surge', count: 12, color: '#10b981' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Production Operational Dashboard</h1>
          <p className="text-xs text-slate-400">Real-time delay prediction & root-cause monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Production Orders"
          value={totalOrders}
          subtitle={`${scheduledCount} Active in queue`}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Critical Delay Risks"
          value={criticalCount}
          subtitle="Requires immediate action"
          icon={ShieldAlert}
          color="purple"
        />
        <MetricCard
          title="High Delay Risks"
          value={highRiskCount}
          subtitle="Attention required"
          icon={AlertTriangle}
          color="rose"
        />
        <MetricCard
          title="Avg Planned Duration"
          value={`${avgDuration} Days`}
          subtitle="Across product lines"
          icon={Clock}
          color="emerald"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" />
            Machine Utilization & Downtime Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="utilization" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} name="Utilization %" />
                <Area type="monotone" dataKey="downtime" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} name="Downtime Hrs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Distribution Chart */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">Production Risk Distribution</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-semibold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-200">Active Production Orders</h3>
          <Link to="/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Product Family</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Utilization</th>
                <th className="p-3">Downtime</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredOrders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-semibold text-indigo-400">{o.order_id}</td>
                  <td className="p-3">{o.product_family}</td>
                  <td className="p-3">{o.order_quantity}</td>
                  <td className="p-3">{o.machine_capacity_utilization}%</td>
                  <td className="p-3">{o.machine_downtime_hours} hrs</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                      {o.order_priority}
                    </span>
                  </td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/orders/${o.id}`}
                      className="px-3 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 rounded text-xs transition"
                    >
                      Diagnose & Recommend
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
