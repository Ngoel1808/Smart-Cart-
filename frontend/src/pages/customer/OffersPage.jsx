import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function OffersPage() {
  const { offers, products } = useData();

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-500/20 p-3 rounded-2xl">
          <Tag className="w-8 h-8 text-brand-400 drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Special Offers</h1>
          <p className="text-brand-400 mt-1 font-medium flex items-center">
            <Sparkles className="w-4 h-4 mr-1" />
            Active deals just for you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => {
          const product = products.find(p => p.id === offer.productId);
          if (!product) return null;
          
          return (
            <div 
              key={offer.id} 
              className="glass-card p-6 rounded-3xl border-t border-brand-500/30 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6 relative">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="bg-brand-500/20 border border-brand-500/30 text-brand-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                  {offer.type}
                </div>
              </div>

              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{product.brand}</p>
                
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                  <p className="text-brand-400 font-extrabold text-lg text-center tracking-wide drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]">
                    {offer.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
