import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSession, login, logout, register } from "../services/auth";
import type { AuthSession } from "../types/auth";

type AuthState = {
  ready: boolean;
  session: AuthSession | null;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children, dbReady }: { children: React.ReactNode; dbReady: boolean }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  async function refresh() {
    const s = await getSession();
    setSession(s && s.isLoggedIn ? s : null);
  }

  async function signIn(email: string, password: string) {
    await login(email, password);
    await refresh();
  }

  async function signUp(email: string, password: string, name: string) {
    await register(name, email, password);
  }

  async function signOut() {
    await logout();
    await refresh();
  }

  useEffect(() => {
    if (!dbReady) return;
    (async () => {
      await refresh();
      setReady(true);
    })();
  }, [dbReady]);

  const value = useMemo<AuthState>(
    () => ({ ready, session, refresh, signIn, signUp, signOut }),
    [ready, session]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
