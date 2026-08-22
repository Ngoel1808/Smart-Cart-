import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  onSnapshot, query, orderBy, getDocs, writeBatch 
} from 'firebase/firestore';
import { mockProducts, mockOffers, mockOrders, mockActivityLogs } from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-seed database if empty
  const checkAndSeedDatabase = async () => {
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty) {
        console.log("Database is empty! Auto-seeding mock data...");
        const batch = writeBatch(db);
        
        mockProducts.forEach(p => {
          batch.set(doc(db, 'products', p.id), p);
        });
        mockOffers.forEach(o => {
          batch.set(doc(db, 'offers', o.id), o);
        });
        mockOrders.forEach(o => {
          batch.set(doc(db, 'orders', o.id), o);
        });
        mockActivityLogs.forEach(a => {
          batch.set(doc(db, 'activity', a.id), a);
        });
        
        await batch.commit();
        console.log("Database seeded successfully!");
      }
    } catch (e) {
      console.error("Error seeding DB:", e);
    }
  };

  useEffect(() => {
    // 1. Seed database if empty
    checkAndSeedDatabase();

    // 2. Setup Real-time Listeners
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOffers = onSnapshot(collection(db, 'offers'), (snapshot) => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qOrders = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qActivity = query(collection(db, 'activity'), orderBy('timestamp', 'desc'));
    const unsubActivity = onSnapshot(qActivity, (snapshot) => {
      setActivityLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubProducts();
      unsubOffers();
      unsubOrders();
      unsubActivity();
    };
  }, []);

  // CRUD Operations
  const addProduct = async (product) => {
    const id = `p${Date.now()}`;
    await setDoc(doc(db, 'products', id), { ...product, id });
  };
  const updateProduct = async (updated) => {
    await updateDoc(doc(db, 'products', updated.id), updated);
  };
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const addOffer = async (offer) => {
    const id = `o${Date.now()}`;
    await setDoc(doc(db, 'offers', id), { ...offer, id });
  };
  const deleteOffer = async (id) => {
    await deleteDoc(doc(db, 'offers', id));
  };

  const addOrder = async (order) => {
    const id = `SC${Date.now()}`;
    await setDoc(doc(db, 'orders', id), { ...order, id, date: new Date().toISOString() });
  };

  const addLog = async (staffName, action) => {
    const id = `a${Date.now()}`;
    await setDoc(doc(db, 'activity', id), { 
      id, staffName, action, timestamp: new Date().toISOString() 
    });
  };

  return (
    <DataContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      offers, addOffer, deleteOffer,
      orders, addOrder,
      activityLogs, addLog
    }}>
      {!loading && children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
