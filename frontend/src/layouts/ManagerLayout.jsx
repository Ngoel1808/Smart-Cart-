import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Tags, Gift, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ManagerLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { name: 'Staff Management', path: '/manager/staff', icon: Users },
    { name: 'Customer Directory', path: '/manager/customers', icon: Users },
    { name: 'Order History', path: '/manager/orders', icon: Package },
    { name: 'Products', path: '/manager/products', icon: Package },
    { name: 'Discounts & Offers', path: '/manager/offers', icon: Gift },
    { name: 'Activity Logs', path: '/manager/logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex font-sans text-slate-200 bg-transparent">
      <aside className="w-64 glass-panel border-r-0 md:border-r border-white/10 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight neon-text">SmartCart</h2>
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]">Manager Portal</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30 shadow-[0_0_15px_rgba(0,255,157,0.1)]' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-500 font-bold shadow-[0_0_10px_rgba(0,255,157,0.2)]">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-brand-400">Store Manager</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto">
        <header className="glass-panel border-b border-white/10 h-16 flex items-center px-8 rounded-none">
          <h1 className="text-xl font-semibold text-white tracking-wide">Manager Dashboard</h1>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
