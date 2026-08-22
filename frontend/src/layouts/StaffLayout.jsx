import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, Tags, FileText, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StaffLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Products & Inventory', path: '/staff/dashboard', icon: Package },
    { name: 'Discounts', path: '/staff/discounts', icon: Tags },
    { name: 'Orders', path: '/staff/orders', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-200 bg-transparent">
      
      {/* Mobile Header */}
      <div className="md:hidden glass-panel rounded-none border-b border-white/10 p-4 flex justify-between items-center z-20 sticky top-0">
        <div>
          <h2 className="text-xl font-bold text-white neon-text leading-tight">SmartCart</h2>
          <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-wider">Staff Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 glass-panel rounded-none border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold text-white tracking-tight neon-text">SmartCart</h2>
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]">Staff Portal</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
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
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-500 font-bold shadow-[0_0_10px_rgba(0,255,157,0.2)] shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-brand-400 truncate">Staff Member</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:h-screen md:overflow-y-auto">
        <header className="hidden md:flex glass-panel rounded-none border-b border-white/10 h-16 items-center px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-white tracking-wide">Staff Dashboard</h1>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
