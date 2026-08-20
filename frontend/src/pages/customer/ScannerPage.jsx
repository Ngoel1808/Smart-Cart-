import React, { useState, useEffect } from 'react';
import { Camera, ScanLine, AlertCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [detectedProduct, setDetectedProduct] = useState(null);
  const { addToCart } = useCart();
  const { products } = useData();
  const navigate = useNavigate();

  // Simulate AI Object Detection
  useEffect(() => {
    let timeout;
    if (isScanning) {
      timeout = setTimeout(() => {
        // Detect a random product after 3 seconds for demo purposes
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setDetectedProduct(randomProduct);
        setIsScanning(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isScanning, products]);

  const handleAddToCart = () => {
    if (detectedProduct) {
      addToCart(detectedProduct.id);
      setDetectedProduct(null);
      setIsScanning(true);
    }
  };

  const handleCheckout = () => {
    navigate('/customer/cart');
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col relative text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Smart Scanner</h1>
          <p className="text-sm text-brand-400 mt-1 font-medium flex items-center">
            <span className="w-2 h-2 bg-brand-500 rounded-full inline-block mr-2 shadow-[0_0_5px_rgba(0,255,157,0.8)] animate-pulse"></span>
            AI Vision Active
          </p>
        </div>
      </div>

      {/* Camera Viewport Simulation */}
      <div className="flex-1 glass-card rounded-3xl overflow-hidden relative border border-brand-500/30 shadow-[0_0_30px_rgba(0,255,157,0.15)] flex flex-col">
        {/* Video feed simulation (black background) */}
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
          <Camera className="w-16 h-16 text-slate-800 mb-4" />
          <p className="text-slate-600 font-medium tracking-widest text-xs">CAMERA FEED ACTIVE</p>
        </div>

        {/* AI Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 shadow-[0_0_15px_rgba(0,255,157,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
            
            {/* Target Box */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-brand-500/50 rounded-3xl flex items-center justify-center">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-brand-500 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-brand-500 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-brand-500 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-brand-500 rounded-br-xl"></div>
              
              <ScanLine className="w-12 h-12 text-brand-500/50 animate-pulse" />
            </div>

            <div className="absolute bottom-8 left-0 w-full text-center">
              <p className="text-brand-400 font-bold bg-slate-900/60 backdrop-blur-md px-6 py-2 rounded-full inline-block border border-brand-500/30">
                Point at any product...
              </p>
            </div>
          </div>
        )}

        {/* Detected Product Overlay */}
        {detectedProduct && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
            {/* Bounding Box on item */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-48 h-48 border-2 border-brand-500 bg-brand-500/10 rounded-xl animate-in zoom-in duration-300 shadow-[0_0_20px_rgba(0,255,157,0.3)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-[0_0_10px_rgba(0,255,157,0.5)]">
                {(Math.random() * 10 + 90).toFixed(1)}% MATCH
              </span>
            </div>

            {/* Product Info Card */}
            <div className="w-full glass-panel rounded-3xl p-6 border-brand-500/40 shadow-[0_0_30px_rgba(0,255,157,0.2)] animate-in slide-in-from-bottom-10">
              <div className="flex gap-4 items-center mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5">
                  {detectedProduct.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-white tracking-wide">{detectedProduct.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-1">{detectedProduct.brand}</p>
                  <div className="flex gap-2 items-center">
                    <span className="font-black text-brand-400 text-2xl">₹{detectedProduct.sellingPrice}</span>
                    {detectedProduct.sellingPrice < detectedProduct.mrp && (
                      <span className="text-sm text-slate-500 line-through font-medium">₹{detectedProduct.mrp}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {setDetectedProduct(null); setIsScanning(true);}}
                  className="flex-1 btn btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="flex-2 w-2/3 btn btn-primary py-3 text-sm shadow-[0_0_15px_rgba(0,255,157,0.4)]"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
