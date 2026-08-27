import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Phone } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export default function ManagerCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for users where role == CUSTOMER
    const q = query(collection(db, 'users'), where('role', '==', 'CUSTOMER'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const custData = [];
      snapshot.forEach((doc) => {
        custData.push({ id: doc.id, ...doc.data() });
      });
      setCustomers(custData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Customer Directory</h1>
        <p className="text-slate-400 mt-1 font-medium">View registered shoppers and contact details</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 glass-panel rounded-3xl">Loading customers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <div key={customer.id} className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-brand-500/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center text-xl font-bold text-slate-900 shadow-[0_0_15px_rgba(0,255,157,0.4)]">
                  {(customer.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{customer.name || 'Unknown Customer'}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 uppercase tracking-wider mt-1">
                    Verified Member
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-300">
                  <Mail className="w-4 h-4 mr-3 text-slate-500" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Phone className="w-4 h-4 mr-3 text-slate-500" />
                  +91 {Math.floor(Math.random() * 9000000000) + 1000000000} {/* Mock phone */}
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Calendar className="w-4 h-4 mr-3 text-slate-500" />
                  Joined {new Date().toLocaleDateString()}
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/manager/orders', { state: { searchTerm: customer.name } })}
                className="w-full mt-6 btn btn-secondary text-sm py-2"
              >
                View Purchase History
              </button>
            </div>
          ))}
          {customers.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-400 glass-panel rounded-3xl">
              No customers found in the system.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
