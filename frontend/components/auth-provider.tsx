"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/lib/types";
import { loginRequest, registerRequest } from "@/lib/client-api";

const STORAGE_KEY = "globaltna_auth";

type Stored = { token: string; user: AuthUser };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed?.token && parsed?.user?.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const s = readStored();
      if (s) {
        setToken(s.token);
        setUser(s.user);
      }
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: Stored | null) => {
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setToken(next.token);
      setUser(next.user);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginRequest(email, password);
      persist({ token: data.token, user: data.user });
    },
    [persist]
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      const data = await registerRequest(email, password, name);
      persist({ token: data.token, user: data.user });
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ token, user, ready, login, register, logout }),
    [token, user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
