import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { TrendingUp, Users, ShoppingBag, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ManagerDashboard() {
  const { products } = useData();
  const lowStock = products.filter(p => p.stock < 20);

  // Mock revenue data for chart
  const data = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 6000 },
    { name: 'Sat', revenue: 8000 },
    { name: 'Sun', revenue: 7500 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-slate-200">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹38,000" 
          trend="+12.5%" 
          isPositive={true}
          icon={<TrendingUp className="w-6 h-6 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
        />
        <StatCard 
          title="Total Orders" 
          value="142" 
          trend="+5.2%" 
          isPositive={true}
          icon={<ShoppingBag className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
        />
        <StatCard 
          title="Active Customers" 
          value="89" 
          trend="-2.1%" 
          isPositive={false}
          icon={<Users className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />}
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStock.length} 
          trend="Action Required" 
          isPositive={false}
          isAlert={true}
          icon={<AlertTriangle className="w-6 h-6 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white tracking-wide">Revenue Trend</h2>
            <select className="glass-input py-1 px-3 text-sm">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#00ff9d' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00ff9d" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Center / Logs */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Activity Log</h2>
          <div className="flex-1 space-y-4 overflow-y-auto">
            <LogItem message="Staff Emma added 50 units of Oreo." time="10 mins ago" type="inventory" />
            <LogItem message="Order #1042 completed." time="25 mins ago" type="order" />
            <LogItem message="Stock alert: Lays Magic Masala running low." time="1 hour ago" type="alert" />
            <LogItem message="Staff John updated price for Red Bull." time="2 hours ago" type="inventory" />
            <LogItem message="Order #1041 completed." time="2.5 hours ago" type="order" />
          </div>
          <button className="w-full mt-4 py-2 text-brand-400 font-medium hover:text-brand-300 transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, isAlert, icon }) {
  return (
    <div className={`glass-card p-6 rounded-3xl border-l-4 ${isAlert ? 'border-l-red-500' : 'border-l-brand-500'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5">
          {icon}
        </div>
        <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
          isAlert ? 'text-red-400 bg-red-500/10' : 
          isPositive ? 'text-brand-400 bg-brand-500/10' : 'text-slate-400 bg-slate-800'
        }`}>
          {isPositive && !isAlert && <ArrowUpRight className="w-4 h-4 mr-1" />}
          {!isPositive && !isAlert && <ArrowDownRight className="w-4 h-4 mr-1" />}
          {trend}
        </div>
      </div>
      <h3 className="text-slate-400 font-medium text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function LogItem({ message, time, type }) {
  return (
    <div className="flex gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
        type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 
        type === 'inventory' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 
        'bg-brand-500 shadow-[0_0_8px_rgba(0,255,157,0.8)]'
      }`}></div>
      <div>
        <p className="text-sm text-slate-300 font-medium">{message}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}
