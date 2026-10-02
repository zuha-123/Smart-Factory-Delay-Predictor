import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { UserCheck, Plus, Trash2 } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete user account?')) return;
    try {
      await userService.deleteUser(userId);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-100">User & Access Management (RBAC)</h1>
          <p className="text-xs text-slate-400">Manage user accounts, roles (Admin, Production Manager, Analyst), and permissions</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="p-3">Full Name</th>
              <th className="p-3">Work Email</th>
              <th className="p-3">Role ID</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-slate-200">{u.full_name}</td>
                <td className="p-3 font-mono text-indigo-400">{u.email}</td>
                <td className="p-3">{u.role_id === 1 ? 'Admin' : u.role_id === 2 ? 'Production Manager' : 'Analyst'}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
