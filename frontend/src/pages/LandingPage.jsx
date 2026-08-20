import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Scan, Tags, BarChart3, Package, Gift } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent font-sans text-slate-200">
      {/* Navbar */}
      <nav className="glass-panel border-b border-white/10 sticky top-0 z-50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-500 drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">
            <ShoppingCart className="w-8 h-8" />
            <span className="font-extrabold text-2xl tracking-tight text-white neon-text">SmartCart</span>
          </div>
          <div>
            <Link to="/login" className="btn btn-primary px-8">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 relative z-10">
          Scan. Shop. <span className="neon-text">Save.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
          AI-powered smart shopping and retail management made simple. Skip the checkout lines and manage your store efficiently.
        </p>
        
        <div className="flex justify-center gap-6 relative z-10">
          <Link to="/login" className="btn btn-primary px-10 py-4 text-lg rounded-full">Start Shopping</Link>
          <Link to="/login" className="btn btn-secondary px-10 py-4 text-lg rounded-full">Manage Store</Link>
        </div>

        {/* Feature Cards */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <FeatureCard 
            icon={<Scan className="w-8 h-8 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
            title="AI Product Recognition"
            description="Point your camera and instantly recognize products using advanced AI vision models."
          />
          <FeatureCard 
            icon={<ShoppingCart className="w-8 h-8 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
            title="Smart Self Checkout"
            description="Add recognized items to your cart automatically and pay directly from your phone."
          />
          <FeatureCard 
            icon={<Tags className="w-8 h-8 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
            title="Real-Time Discounts"
            description="Instant calculation of BOGO offers, percentage discounts, and flat rate deductions."
          />
          <FeatureCard 
            icon={<Gift className="w-8 h-8 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
            title="BOGO Offers"
            description="Advanced offer engine that supports complex Buy X Get Y Free promotions."
          />
          <FeatureCard 
            icon={<Package className="w-8 h-8 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
            title="Inventory Management"
            description="Keep track of stock levels automatically as customers purchase items."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-brand-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
            title="Sales Analytics"
            description="Comprehensive manager dashboard for tracking revenue and top-selling products."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card p-8 rounded-3xl text-left flex flex-col justify-between">
      <div>
        <div className="mb-6 p-4 bg-brand-500/10 inline-block rounded-2xl border border-brand-500/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
