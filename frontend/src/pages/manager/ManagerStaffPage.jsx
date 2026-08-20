import React from 'react';
import { Users } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

export default function ManagerStaffPage() {
  const staffMembers = mockUsers.filter(u => u.role === 'STAFF');

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Staff Management</h1>
        <p className="text-slate-400 mt-1 font-medium">Manage employees and portal access</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-slate-300 border-b border-white/10 text-sm tracking-wide">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staffMembers.map(staff => (
              <tr key={staff.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="font-bold text-white">{staff.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </td>
              </tr>
            ))}
            {staffMembers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
