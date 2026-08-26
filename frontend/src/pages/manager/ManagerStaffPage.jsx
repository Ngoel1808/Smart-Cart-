import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { db, firebaseConfig } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function ManagerStaffPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all staff members from Firestore
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'STAFF'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staffData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffMembers(staffData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAddStaff = async (newStaff) => {
    try {
      // We must initialize a secondary Firebase app to create a user account
      // Otherwise, Firebase Auth will automatically log the Manager out and log the new Staff in!
      let secondaryApp;
      const apps = getApps();
      const existingApp = apps.find(app => app.name === 'Secondary');
      if (existingApp) secondaryApp = existingApp;
      else secondaryApp = initializeApp(firebaseConfig, 'Secondary');
      
      const secondaryAuth = getAuth(secondaryApp);
      
      // 1. Create the Auth account
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newStaff.email, newStaff.password);
      
      // 2. Log out and destroy the secondary app immediately to prevent session cross-contamination
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      // 3. Write their profile to Firestore (using our main DB instance)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: newStaff.name,
        email: newStaff.email,
        role: 'STAFF',
        points: 0
      });
      
    } catch (err) {
      console.error("Failed to add staff:", err);
      alert(err.message);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to revoke this staff member's access?")) {
      try {
        // Deleting the document revokes their app access because the dashboard routing relies on the role in the DB.
        // Full Auth deletion requires Admin SDK, but this secures the app.
        await deleteDoc(doc(db, 'users', id));
      } catch (err) {
        console.error("Failed to revoke access:", err);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-300 text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Staff Management</h1>
          <p className="text-slate-400 mt-1 font-medium">Manage employees and portal access</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary shadow-[0_0_15px_rgba(0,255,157,0.3)]"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Staff
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-slate-300 border-b border-white/10 text-sm tracking-wide">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email / Login</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
               <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading staff...</td></tr>
            ) : staffMembers.length === 0 ? (
               <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No staff members found.</td></tr>
            ) : staffMembers.map(staff => (
              <tr key={staff.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="font-bold text-white">{staff.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDeleteStaff(staff.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    title="Revoke Access"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <AddStaffModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddStaff}
        />
      )}
    </div>
  );
}

function AddStaffModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-white mb-6">Add Staff Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
            <input required type="text" className="w-full glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Login Email</label>
            <input required type="email" className="w-full glass-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Temporary Password</label>
            <input required type="text" minLength={6} className="w-full glass-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} disabled={loading} />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="btn btn-secondary px-6" disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary px-8 shadow-[0_0_15px_rgba(0,255,157,0.4)]" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
