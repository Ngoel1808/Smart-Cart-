import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Gift, Star, Award, Ticket, CheckCircle } from 'lucide-react';

export default function CustomerRewardsPage() {
  const { user } = useAuth();
  
  const currentPoints = user?.points || 0;
  
  const rewards = [
    { id: 1, title: '₹100 Off Next Order', cost: 100, icon: <Ticket className="w-8 h-8 text-blue-400" /> },
    { id: 2, title: 'Free Pepsi (500ml)', cost: 50, icon: <Gift className="w-8 h-8 text-red-400" /> },
    { id: 3, title: '20% Discount on Snacks', cost: 200, icon: <Award className="w-8 h-8 text-purple-400" /> },
    { id: 4, title: 'Mystery Gift Box', cost: 500, icon: <Star className="w-8 h-8 text-yellow-400" /> },
  ];

  return (
    <div className="animate-in fade-in duration-300 text-slate-200 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">My Rewards</h1>
        <p className="text-slate-400 mt-1 font-medium">Earn Smart Points on every purchase and redeem them for exciting offers!</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 mb-8 border border-brand-500/30 shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/20 blur-3xl rounded-full"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-brand-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.3)]">
              <Star className="w-10 h-10 text-brand-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-slate-400 font-medium">Available Balance</p>
              <h2 className="text-5xl font-extrabold text-white neon-text">{currentPoints} <span className="text-2xl text-brand-400">Pts</span></h2>
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 max-w-xs text-sm text-slate-300">
            <p className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-brand-400 shrink-0" />
              <span>Earn 1 Smart Point for every ₹100 spent in the store!</span>
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Redeem Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map(reward => {
          const canAfford = currentPoints >= reward.cost;
          return (
            <div key={reward.id} className={`glass-card p-6 rounded-3xl flex items-center gap-4 transition-all ${canAfford ? 'border-l-4 border-l-brand-500 hover:bg-white/5 hover:-translate-y-1' : 'opacity-75 grayscale'}`}>
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 shrink-0">
                {reward.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{reward.title}</h3>
                <p className="text-sm font-semibold text-brand-400">{reward.cost} Points</p>
              </div>
              <button 
                disabled={!canAfford}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md ${canAfford ? 'bg-brand-500 text-slate-900 hover:bg-brand-400 hover:shadow-[0_0_15px_rgba(0,255,157,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                onClick={() => alert('Redemption simulated successfully! Coupon added to your account.')}
              >
                {canAfford ? 'Redeem' : 'Locked'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
