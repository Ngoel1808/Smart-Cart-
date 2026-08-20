import React, { useState } from 'react';
import { Search, Store, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function StoreCatalogPage() {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-500/20 p-3 rounded-2xl">
          <Store className="w-8 h-8 text-brand-400 drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Store Catalog</h1>
          <p className="text-slate-400 mt-1 font-medium flex items-center">
            Find items and their aisle locations
          </p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for snacks, beverages, brands..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-12 py-4 text-lg rounded-2xl border-white/10 focus:border-brand-500/50"
          />
          <Search className="w-6 h-6 text-slate-500 absolute left-4 top-4" />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? 'bg-brand-500 text-slate-950 shadow-[0_0_15px_rgba(0,255,157,0.4)]' 
                  : 'bg-slate-900/50 text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Search className="w-16 h-16 mx-auto mb-4 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="glass-card p-5 rounded-3xl flex flex-col items-center text-center group border-t border-white/5 hover:border-brand-500/30 transition-colors"
            >
              <div className="w-32 h-32 mb-4 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-slate-200 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{product.brand}</p>
              
              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-brand-400 font-black text-lg">₹{product.sellingPrice}</span>
                <span className="flex items-center text-[10px] uppercase tracking-wider font-bold bg-slate-900 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
                  <MapPin className="w-3 h-3 mr-1 text-brand-500" />
                  {product.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
