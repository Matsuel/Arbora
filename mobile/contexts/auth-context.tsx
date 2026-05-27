import { authController } from "@/controllers/auth.controller";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshSession = useCallback(async () => {
    const {
      data: { session },
    } = await authController.getSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
    setIsInitialized(true);
  }, []);

  const signOut = useCallback(async () => {
    await authController.signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    refreshSession();

    const unsubscribe = authController.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      setIsInitialized(true);
    });

    return unsubscribe;
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isInitialized, refreshSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
