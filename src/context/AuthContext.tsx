"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseApp, initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, Auth } from "firebase/auth";
import { firebaseConfig } from '@/firebase.config';
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: async () => {},
      signup: async () => {},
      logout: async () => {},
      loading: false,
    };
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast()
    const [auth, setAuth] = useState<Auth | null>(null);

  const signup = async (email: string, password: string) => {};

  const login = async (email: string, password: string) => {};

  const logout = async () => {};

  const value: AuthContextType = {
    user: null,
    login:  async () => {},
    signup:  async () => {},
    logout:  async () => {},
    loading: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
