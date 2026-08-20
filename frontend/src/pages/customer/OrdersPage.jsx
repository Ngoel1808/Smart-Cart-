import React from 'react';
import { ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function OrdersPage() {
  const { orders } = useData();

  // For mock data, filter orders for the current mock customer ('u1')
  const customerOrders = orders.filter(o => o.customerId === 'u1');

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-500/20 p-3 rounded-2xl">
          <ShoppingBag className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Your Orders</h1>
          <p className="text-slate-400 mt-1 font-medium">View your past purchases and receipts</p>
        </div>
      </div>

      <div className="space-y-6">
        {customerOrders.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center">
            <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Past Orders</h3>
            <p className="text-slate-400">You haven't completed any checkouts yet.</p>
          </div>
        ) : (
          customerOrders.map(order => (
            <div key={order.id} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                  <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-4 text-sm text-slate-300">
                  <span className="font-semibold text-white">{order.items.length} items</span> purchased
                </div>
              </div>
              
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-right w-full md:w-auto">
                <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                <p className="text-3xl font-extrabold text-white">₹{order.total.toFixed(2)}</p>
                <button className="text-brand-400 text-sm font-bold mt-2 hover:text-brand-300 transition-colors">
                  View Receipt
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
