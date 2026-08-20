import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Search, Edit2, AlertCircle } from 'lucide-react';

export default function StaffDashboard() {
  const { products, addProduct } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Product Inventory</h1>
          <p className="text-slate-400 mt-1 font-medium">Manage stock levels and update pricing</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search products..."
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
            Add New
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-slate-300 border-b border-white/10 text-sm tracking-wide">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Price (₹)</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Aisle</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-slate-900 rounded-xl flex items-center justify-center text-2xl border border-white/5 shadow-inner overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=0f172a&color=00ff9d&size=100&font-size=0.33`;
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-bold text-white">{product.name}</div>
                        <div className="text-sm text-brand-400 font-medium">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">₹{product.sellingPrice}</div>
                    {product.sellingPrice < product.mrp && (
                      <div className="text-xs text-slate-500 line-through">₹{product.mrp}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock < 20 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {product.stock} (Low)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {product.stock} in stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 capitalize">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">Aisle {product.aisle}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-brand-400 hover:text-brand-300 transition-colors p-2 hover:bg-brand-500/10 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddProductModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={addProduct} 
          existingCategories={[...new Set(products.map(p => p.category))]}
        />
      )}
    </div>
  );
}

// Simple Add Product Modal Implementation
function AddProductModal({ onClose, onAdd, existingCategories = [] }) {
  const [formData, setFormData] = useState({
    name: '', brand: '', mrp: '', sellingPrice: '', stock: '', category: existingCategories[0] || 'Snacks', image: ''
  });
  const [isNewCategory, setIsNewCategory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      mrp: parseFloat(formData.mrp),
      sellingPrice: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stock, 10),
      image: formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0f172a&color=00ff9d&size=300&font-size=0.33`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
              <input required type="text" className="w-full glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Brand</label>
              <input required type="text" className="w-full glass-input" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">MRP (₹)</label>
              <input required type="number" min="0" step="0.01" className="w-full glass-input" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Selling Price (₹)</label>
              <input required type="number" min="0" step="0.01" className="w-full glass-input" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Initial Stock</label>
              <input required type="number" min="0" className="w-full glass-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex justify-between items-center text-sm font-medium text-slate-400 mb-1">
                <span>Category</span>
                {isNewCategory && (
                  <button type="button" onClick={() => setIsNewCategory(false)} className="text-[10px] text-brand-400 hover:underline">Cancel</button>
                )}
              </label>
              {isNewCategory ? (
                <input required type="text" placeholder="New Category Name..." className="w-full glass-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} autoFocus />
              ) : (
                <select 
                  className="w-full glass-input text-slate-200 bg-slate-900" 
                  value={formData.category} 
                  onChange={e => {
                    if(e.target.value === 'ADD_NEW') {
                      setIsNewCategory(true);
                      setFormData({...formData, category: ''});
                    } else {
                      setFormData({...formData, category: e.target.value});
                    }
                  }}
                >
                  {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="ADD_NEW" className="text-brand-400 font-bold">+ Add New Category...</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
              <input type="url" placeholder="https://..." className="w-full glass-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="btn btn-secondary px-6">Cancel</button>
            <button type="submit" className="btn btn-primary px-8 shadow-[0_0_15px_rgba(0,255,157,0.4)]">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
