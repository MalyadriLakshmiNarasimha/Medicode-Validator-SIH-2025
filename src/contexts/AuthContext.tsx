import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user database. In a real application, this would be your backend database.
const mockUsersDB: User[] = [
  { id: 'doc-01', name: 'Dr. Evelyn Reed', email: 'doctor@medicode.com', role: 'doctor' },
  { id: 'adm-01', name: 'Arthur Vance', email: 'admin@medicode.com', role: 'admin' },
  { id: 'cod-01', name: 'Jia Li', email: 'coder@medicode.com', role: 'medical_coder' },
  { id: 'aud-01', name: 'Kenji Tanaka', email: 'auditor@medicode.com', role: 'auditor' },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('medicode_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with a real API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would verify the password against a hash.
      // For this mock setup, we'll just check if the user exists and the password is 'password123'.
      const foundUser = mockUsersDB.find(u => u.email === email);

      if (foundUser && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('medicode_user', JSON.stringify(foundUser));
        return true;
      }

      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicode_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
