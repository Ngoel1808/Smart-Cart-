import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Scan, Tag, ShoppingCart, Clock, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CustomerLayout() {
  const { logout, user } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/customer/dashboard', icon: Home },
    { name: 'Scan', path: '/customer/scan', icon: Scan },
    { name: 'Offers', path: '/customer/offers', icon: Tag },
    { name: 'Cart', path: '/customer/cart', icon: ShoppingCart, count: cartItems.length },
    { name: 'Orders', path: '/customer/orders', icon: Clock },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-200 bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r-0 md:border-r border-white/10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight neon-text">SmartCart</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30 shadow-[0_0_15px_rgba(0,255,157,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                {item.name}
                {item.count > 0 && (
                  <span className="ml-auto bg-brand-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                    {item.count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-500 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-500">Customer</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden glass-panel rounded-none border-b border-white/10 p-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold neon-text">SmartCart</h2>
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-slate-300" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                {cartItems.length}
              </span>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel rounded-none border-t border-white/10 flex justify-around items-center h-16 pb-safe z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]' : ''}`} />
                {item.count > 0 && item.name === 'Cart' && (
                  <span className="absolute -top-1 -right-2 bg-brand-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
