import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, api, ApiError } from "../lib/api";

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  clinicId?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.getUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await api.login(identifier, password);
      auth.save(result);
      setUser(result.user);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    auth.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
