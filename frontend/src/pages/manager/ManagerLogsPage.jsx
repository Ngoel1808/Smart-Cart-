import React from 'react';
import { useData } from '../../context/DataContext';
import { Activity } from 'lucide-react';

export default function ManagerLogsPage() {
  const { activityLogs } = useData();

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Activity Logs</h1>
        <p className="text-slate-400 mt-1 font-medium">System audit and staff action history</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 p-6">
        <div className="space-y-4">
          {activityLogs.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  <span className="text-brand-400 font-bold">{log.staffName}</span> {log.action}
                </p>
                <p className="text-xs text-slate-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {(!activityLogs || activityLogs.length === 0) && (
            <div className="text-center py-12 text-slate-500">No recent activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
