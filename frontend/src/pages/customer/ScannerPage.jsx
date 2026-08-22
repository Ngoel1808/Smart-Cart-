import React, { useState } from 'react';
import { Camera, ShoppingCart, ScanLine } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export default function ScannerPage() {
  const [detectedProduct, setDetectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { products } = useData();
  const navigate = useNavigate();

  const startScan = async () => {
    try {
      // Request camera permissions
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
        alert("Camera permission is required to scan products.");
        return;
      }

      // Open the native camera view
      const { barcodes } = await BarcodeScanner.scan();

      if (barcodes && barcodes.length > 0) {
        // We got a real barcode!
        const scannedCode = barcodes[0].rawValue;
        
        // Since our mock database doesn't have real barcode numbers, 
        // we'll randomly pick a product to demonstrate the UI works, 
        // but log the actual real barcode you scanned!
        console.log("Actual barcode scanned:", scannedCode);
        
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        // You could theoretically match it here: 
        // const found = products.find(p => p.barcode === scannedCode);
        
        setDetectedProduct(randomProduct);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error scanning:", error);
      alert("Scanner was closed or an error occurred.");
    }
  };

  const handleAddToCart = () => {
    if (detectedProduct) {
      addToCart(detectedProduct.id, quantity);
      setDetectedProduct(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col relative text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Smart Scanner</h1>
          <p className="text-sm text-brand-400 mt-1 font-medium flex items-center">
            <span className="w-2 h-2 bg-brand-500 rounded-full inline-block mr-2 shadow-[0_0_5px_rgba(0,255,157,0.8)] animate-pulse"></span>
            Camera Ready
          </p>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-3xl overflow-hidden relative border border-brand-500/30 shadow-[0_0_30px_rgba(0,255,157,0.15)] flex flex-col">
        
        {/* Default State: Waiting for user to click Scan */}
        {!detectedProduct && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <ScanLine className="w-24 h-24 text-brand-500 mb-6 drop-shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
            <h2 className="text-2xl font-bold text-white mb-2">Tap to Scan</h2>
            <p className="text-slate-400 mb-8">Use your phone's camera to scan any product barcode in the store.</p>
            <button 
              onClick={startScan}
              className="btn btn-primary w-full max-w-xs py-4 text-lg shadow-[0_0_20px_rgba(0,255,157,0.4)]"
            >
              <Camera className="w-6 h-6 mr-3" />
              Open Camera
            </button>
          </div>
        )}

        {/* Detected Product Overlay */}
        {detectedProduct && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            {/* Product Info Card */}
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border-brand-500/40 shadow-[0_0_30px_rgba(0,255,157,0.2)] animate-in zoom-in duration-300">
              <div className="flex gap-4 items-center mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5 overflow-hidden shrink-0">
                  <img src={detectedProduct.image} alt={detectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-xl text-white tracking-wide line-clamp-1">{detectedProduct.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-1">{detectedProduct.brand}</p>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 items-center">
                      <span className="font-black text-brand-400 text-2xl">₹{detectedProduct.sellingPrice}</span>
                      {detectedProduct.sellingPrice < detectedProduct.mrp && (
                        <span className="text-sm text-slate-500 line-through font-medium">₹{detectedProduct.mrp}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Quantity Selector */}
                <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400 font-medium pl-2">Quantity</span>
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-400 hover:bg-slate-800 transition-colors text-lg font-bold"
                    >-</button>
                    <span className="px-4 font-bold text-white text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-brand-500 hover:bg-slate-800 transition-colors text-lg font-bold"
                    >+</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDetectedProduct(null)}
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
          </div>
        )}
      </div>
    </div>
  );
}
