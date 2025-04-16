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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast()
    const [auth, setAuth] = useState<Auth | null>(null);

  // Initialize Firebase only once
  useEffect(() => {
    if (!firebaseConfig || typeof firebaseConfig !== 'object') {
      console.error('Firebase configuration is missing or invalid:', firebaseConfig);
      return;
    }

    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      try {
        initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
          // Get the auth instance after Firebase is initialized
          setAuth(getAuth());
      } catch (error: any) {
        console.error("Failed to initialize Firebase:", error.message);
        toast({
          variant: 'destructive',
          title: 'Firebase Initialization Failed',
          description: 'There was an error initializing Firebase. Please check your configuration.',
        });
        return;
      }
    } else {
        // Firebase already initialized, get the auth instance
        setAuth(getAuth());
    }
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [auth]);

  const signup = async (email: string, password: string) => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Firebase authentication not initialized.',
      });
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Signup Successful",
        description: "Your account has been successfully created.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "There was an error creating your account.",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Firebase authentication not initialized.',
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials.",
      });
      throw error;
    }
   };

  const logout = async () => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Firebase authentication not initialized.',
      });
      return;
    }
    try {
      await signOut(auth);
      toast({
        title: "Logout Successful",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "There was an error logging out.",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
