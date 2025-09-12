'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>; 
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/fetchuser', {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res=await api.post("/auth/login",{email,password})

    // After successful login, fetch user again
    // const res = await axios.get('http://localhost:8080/api/auth/fetchuser', {
    //   withCredentials: true,
    // });
    console.log(res,"--------------")
    setUser(res.data.data);
    return res.data.data;
  };

  const logout = async () => {
    await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
