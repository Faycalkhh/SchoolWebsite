"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/types";

interface AuthCtx {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("nur_session");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(u: User) {
    setUser(u);
    sessionStorage.setItem("nur_session", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("nur_session");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
