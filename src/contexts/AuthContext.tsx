'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'tenant' | 'landlord' | 'broker' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'tenant' | 'landlord' | 'broker';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('rentapp_token');
        if (token) {
          // In a real app, you'd verify the token with your backend
          // For now, we'll simulate a user check
          const userData = localStorage.getItem('rentapp_user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('rentapp_token');
        localStorage.removeItem('rentapp_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      // Simulate API call - in real app, this would be a backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your backend
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        phone: '+1234567890',
        role: 'tenant',
        avatar: '/api/placeholder/100/100',
        bio: 'Welcome to Rentapp!',
        createdAt: new Date().toISOString()
      };

      // Mock token
      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('rentapp_token', token);
      localStorage.setItem('rentapp_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user creation
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        avatar: '/api/placeholder/100/100',
        bio: '',
        createdAt: new Date().toISOString()
      };

      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('rentapp_token', token);
      localStorage.setItem('rentapp_user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rentapp_token');
    localStorage.removeItem('rentapp_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
