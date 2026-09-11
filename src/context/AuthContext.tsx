"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getSessionUser, signOut } from "@/lib/store";
import type { User } from "@/lib/types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef               = useRef<User | null>(null);

  useEffect(() => {
    let active = true;

    // onAuthStateChange emits INITIAL_SESSION as soon as it subscribes, so this
    // covers the first load too. Loading the session separately alongside it
    // would race, and could clear the user right after a successful sign-in.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (!active) return;
        userRef.current = null;
        setUser(null);
        setLoading(false);
        return;
      }

      // A session exists but its profile isn't loaded yet: report "loading" so
      // route guards wait instead of seeing user === null and bouncing to /login.
      if (!userRef.current) setLoading(true);

      // Never await a Supabase call inside this callback. It runs while the auth
      // client holds its internal lock, and awaiting re-enters that lock, which
      // dead-locks every later request in the tab. Defer to the next tick.
      setTimeout(async () => {
        try {
          const u = await getSessionUser();
          if (!active) return;
          userRef.current = u;
          // Reuse the previous object when the signed-in user hasn't changed, so
          // effects keyed on `user` don't refetch on every tab refocus.
          setUser((prev) => (prev && u && prev.id === u.id ? prev : u));
        } catch (e) {
          // A transient failure shouldn't sign the user out of the UI — keep
          // whatever we already had and let the next auth event refresh it.
          console.error("[AuthContext] failed to load the session user:", e);
        } finally {
          // Must always run: leaving `loading` true would hang every route
          // guard on a blank screen.
          if (active) setLoading(false);
        }
      }, 0);
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function logout() {
    // Clear local state even if the network call fails, so a failed sign-out
    // can't leave the UI believing the user is still logged in.
    try {
      await signOut();
    } catch (e) {
      console.error("[AuthContext] sign-out failed:", e);
    }
    userRef.current = null;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
