import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockProducts, mockOffers, mockOrders, mockActivityLogs } from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useLocalStorage('smartcart_products', mockProducts);
  const [offers, setOffers] = useLocalStorage('smartcart_offers', mockOffers);
  const [orders, setOrders] = useLocalStorage('smartcart_orders', mockOrders);
  const [activityLogs, setActivityLogs] = useLocalStorage('smartcart_activity', mockActivityLogs);

  const addProduct = (product) => setProducts([...products, { ...product, id: `p${Date.now()}` }]);
  const updateProduct = (updated) => setProducts(products.map(p => p.id === updated.id ? updated : p));
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  const addOffer = (offer) => setOffers([...offers, { ...offer, id: `o${Date.now()}` }]);
  const deleteOffer = (id) => setOffers(offers.filter(o => o.id !== id));

  const addOrder = (order) => setOrders([{ ...order, id: `SC${Date.now()}`, date: new Date().toISOString() }, ...orders]);

  const addLog = (staffName, action) => {
    setActivityLogs([{ id: `a${Date.now()}`, staffName, action, timestamp: new Date().toISOString() }, ...activityLogs]);
  };

  return (
    <DataContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      offers, addOffer, deleteOffer,
      orders, addOrder,
      activityLogs, addLog
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
