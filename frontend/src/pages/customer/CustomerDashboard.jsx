import React from 'react';
import { Search, MapPin, Tag } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function CustomerDashboard() {
  const { products, offers } = useData();
  
  // Just show 4 random products for "Recently Viewed"
  const recentProducts = products.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-200">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Good Morning!</h1>
          <p className="text-slate-400 mt-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Shopping at <strong className="ml-1 text-slate-200">SmartCart Downtown</strong>
          </p>
        </div>
        <div className="w-full md:w-96 relative">
          <input 
            type="text" 
            placeholder="Search products in-store..." 
            className="w-full glass-input pl-11"
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
        </div>
      </div>

      {/* Active Offers Banner */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Active In-Store Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map(offer => (
            <div key={offer.id} className="glass-card p-5 rounded-2xl flex items-center border-l-4 border-l-brand-500">
              <div className="bg-brand-500/20 p-3 rounded-full mr-4 shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                <Tag className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                <p className="text-sm text-brand-400 font-medium">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recommended For You</h2>
          <button className="text-brand-400 text-sm font-medium hover:text-brand-300">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentProducts.map(product => (
            <div key={product.id} className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group cursor-pointer">
              <div className="w-24 h-24 mb-3 flex items-center justify-center text-4xl bg-slate-900 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {product.icon}
              </div>
              <h3 className="font-semibold text-slate-200 mb-1">{product.name}</h3>
              <p className="text-brand-400 font-bold mb-2">₹{product.price}</p>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">Aisle {product.aisle}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
