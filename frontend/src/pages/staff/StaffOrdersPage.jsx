import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { mockUsers } from '../../data/mockData';
import { FileText, Search, ChevronDown, ChevronUp, User } from 'lucide-react';

export default function StaffOrdersPage() {
  const { orders, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const filteredOrders = orders.filter(order => {
    const customer = mockUsers.find(u => u.id === order.customerId);
    const searchStr = `${order.id} ${customer?.name || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Order History</h1>
          <p className="text-slate-400 mt-1 font-medium">View all customer transactions in real-time</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search Order ID or Customer..."
            className="w-full glass-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-slate-300 border-b border-white/10 text-sm tracking-wide">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => {
                const customer = mockUsers.find(u => u.id === order.customerId);
                const isExpanded = expandedOrderId === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`transition-colors cursor-pointer ${isExpanded ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      <td className="px-6 py-4 font-bold text-brand-400">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{customer?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-500">{customer?.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(order.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          {order.status || 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expandable Order Details Row */}
                    {isExpanded && (
                      <tr className="bg-black/20 border-b border-white/5">
                        <td colSpan="6" className="px-6 py-6">
                          <div className="max-w-4xl mx-auto bg-slate-900/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                            <h4 className="text-lg font-bold text-white mb-4">Purchased Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => {
                                const product = products.find(p => p.id === item.productId);
                                if (!product) return null;
                                return (
                                  <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-200">{product.name}</p>
                                        <p className="text-xs text-brand-400">₹{product.sellingPrice} × {item.quantity}</p>
                                      </div>
                                    </div>
                                    <div className="font-bold text-white">
                                      ₹{(product.sellingPrice * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                              <div className="text-right">
                                <p className="text-sm text-slate-400 mb-1">Subtotal: <span className="text-slate-200 inline-block w-20">₹{order.subtotal?.toFixed(2)}</span></p>
                                <p className="text-sm text-brand-400 mb-2">Discount: <span className="inline-block w-20">-₹{order.discount?.toFixed(2)}</span></p>
                                <p className="text-xl font-bold text-white border-t border-white/10 pt-2 mt-2">Total Paid: <span className="text-brand-400 inline-block w-20">₹{order.total?.toFixed(2)}</span></p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
