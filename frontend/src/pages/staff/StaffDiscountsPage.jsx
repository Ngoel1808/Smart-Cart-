import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Tags, Plus, Trash2, Search } from 'lucide-react';

export default function StaffDiscountsPage() {
  const { offers, products, addOffer, deleteOffer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredOffers = offers.filter(offer => {
    const product = products.find(p => p.id === offer.productId);
    return product && product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Discounts & Offers</h1>
          <p className="text-slate-400 mt-1 font-medium">Manage active promotional campaigns</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by product..."
              className="w-full glass-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary shadow-[0_0_15px_rgba(0,255,157,0.3)]"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Offer
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-slate-300 border-b border-white/10 text-sm tracking-wide">
                <th className="px-6 py-4 font-semibold">Offer / Promotion</th>
                <th className="px-6 py-4 font-semibold">Target Product</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOffers.map(offer => {
                const product = products.find(p => p.id === offer.productId);
                return (
                  <tr key={offer.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-lg">{offer.label}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-white/5 shadow-inner mr-3">
                          <img 
                            src={product?.image} 
                            alt={product?.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product?.name || 'P')}&background=0f172a&color=00ff9d&size=100&font-size=0.33`;
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{product?.name}</div>
                          <div className="text-xs text-brand-400">₹{product?.sellingPrice}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 tracking-wider">
                        {offer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete this offer: "${offer.label}"?`)) {
                            deleteOffer(offer.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOffers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    No active offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddOfferModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={addOffer} 
          products={products}
        />
      )}
    </div>
  );
}

function AddOfferModal({ onClose, onAdd, products }) {
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    type: 'BOGO', // BOGO, PERCENTAGE, FLAT
    label: '',
    discountValue: 0,
    buyQuantity: 1,
    freeQuantity: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      buyQuantity: parseInt(formData.buyQuantity, 10),
      freeQuantity: parseInt(formData.freeQuantity, 10)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Offer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Target Product</label>
            <select 
              required 
              className="w-full glass-input text-slate-200 bg-slate-900" 
              value={formData.productId} 
              onChange={e => setFormData({...formData, productId: e.target.value})}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (₹{p.sellingPrice})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Offer Type</label>
              <select 
                className="w-full glass-input text-slate-200 bg-slate-900" 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value, label: ''})}
              >
                <option value="BOGO">Buy X Get Y Free</option>
                <option value="PERCENTAGE">% Discount</option>
                <option value="FLAT">Flat ₹ Discount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Offer Title (Customer Facing)</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. 50% OFF!" 
                className="w-full glass-input" 
                value={formData.label} 
                onChange={e => setFormData({...formData, label: e.target.value})} 
              />
            </div>
          </div>

          {formData.type === 'BOGO' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Buy Quantity (X)</label>
                <input required type="number" min="1" className="w-full glass-input" value={formData.buyQuantity} onChange={e => setFormData({...formData, buyQuantity: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Free Quantity (Y)</label>
                <input required type="number" min="1" className="w-full glass-input" value={formData.freeQuantity} onChange={e => setFormData({...formData, freeQuantity: e.target.value})} />
              </div>
            </div>
          )}

          {(formData.type === 'PERCENTAGE' || formData.type === 'FLAT') && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Discount Value ({formData.type === 'PERCENTAGE' ? '%' : '₹'})
              </label>
              <input required type="number" min="1" step="0.01" className="w-full glass-input" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="btn btn-secondary px-6">Cancel</button>
            <button type="submit" className="btn btn-primary px-8 shadow-[0_0_15px_rgba(0,255,157,0.4)]">Create Offer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
