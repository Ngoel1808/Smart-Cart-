import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { Trash2, Plus, Minus, Tag, CreditCard, ChevronRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotals, clearCart } = useCart();
  const { products, addOrder } = useData();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Populate cart items with full product details
  const populatedCartItems = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, ...product };
  }).filter(item => item.id); // Filter out items where product wasn't found

  if (populatedCartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-slate-200">
        <div className="w-48 h-48 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,157,0.1)]">
          <ShoppingCart className="w-20 h-20 text-slate-700" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-8 max-w-sm">Looks like you haven't scanned anything yet. Start scanning to fill it up!</p>
        <Link to="/customer/scan" className="btn btn-primary text-lg px-8 py-3">Start Scanning</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call and save order
    setTimeout(() => {
      addOrder({
        customerId: 'u1',
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        subtotal: cartTotals.subtotal,
        discount: cartTotals.discount,
        total: cartTotals.total * 1.18,
        status: 'Completed'
      });
      clearCart();
      alert("Payment Successful! Your receipt is generated.");
      window.location.href = '/customer/orders';
    }, 2000);
  };

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-wide">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {populatedCartItems.map(item => (
            <div key={item.id} className="glass-card p-4 rounded-2xl flex items-center gap-4 relative">
              <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center text-4xl shadow-inner border border-white/5">
                {item.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <p className="text-sm text-slate-400 font-medium mb-1">{item.brand}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-brand-400 text-lg">₹{item.sellingPrice}</span>
                      {item.sellingPrice < item.mrp && (
                        <span className="text-xs text-slate-500 line-through font-medium">₹{item.mrp}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center bg-slate-950/50 border border-slate-700 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1 text-slate-400 hover:bg-slate-800 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-white text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 text-brand-500 hover:bg-slate-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">₹{(item.sellingPrice * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="glass-card p-6 rounded-3xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Subtotal ({populatedCartItems.length} items)</span>
                <span>₹{cartTotals.subtotal.toFixed(2)}</span>
              </div>
              
              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-brand-400 font-medium bg-brand-500/10 p-2 -mx-2 rounded-lg">
                  <span className="flex items-center"><Tag className="w-3 h-3 mr-1" /> Offers Applied</span>
                  <span>-₹{cartTotals.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 font-medium pb-4 border-b border-white/10">
                <span>Taxes & GST (18%)</span>
                <span>₹{(cartTotals.total * 0.18).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-white">Total Amount</span>
                <span className="text-3xl font-extrabold neon-text">₹{(cartTotals.total * 1.18).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full btn btn-primary py-4 text-lg rounded-2xl flex justify-between items-center shadow-[0_0_20px_rgba(0,255,157,0.25)]"
            >
              <span className="flex items-center gap-2">
                {isCheckingOut ? (
                  <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full inline-block"></span>
                ) : (
                  <CreditCard className="w-6 h-6" />
                )}
                {isCheckingOut ? 'Processing...' : 'Pay Now'}
              </span>
              {!isCheckingOut && <ChevronRight className="w-6 h-6" />}
            </button>
            <p className="text-center text-xs text-slate-500 mt-4 font-medium flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-brand-500 rounded-full inline-block shadow-[0_0_5px_rgba(0,255,157,0.8)] animate-pulse"></span>
              Secure SSL Encrypted Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
