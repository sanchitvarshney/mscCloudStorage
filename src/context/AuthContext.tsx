import React, { createContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";

export const AuthContext = createContext<any | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>({
    name: "",
    imgUrl: "",
    id: "",
  });

  const signIn = useCallback(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);

      const userData = {
        name: storedUser.username,
      };

      setUser(userData);
    }
  }, []);

  useEffect(() => {
    signIn();
  }, [signIn]);

  const signOut = useCallback(() => {
    window.location.href = "/signin";
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
