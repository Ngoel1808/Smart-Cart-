import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('smartcart_user', null);
  const [users, setUsers] = useLocalStorage('smartcart_users', mockUsers);

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

  const addPoints = (points) => {
    if (user) {
      const newPoints = (user.points || 0) + points;
      const updatedUser = { ...user, points: newPoints };
      setUser(updatedUser);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
