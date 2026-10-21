import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../features/authentication/services/auth_service.ts";

import type { LoginCredentials, User } from "../features/authentication/types";

const TOKEN_KEY = "accessToken";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const savedToken = sessionStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        if (active) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(savedToken);

        if (active) {
          setToken(savedToken);
          setUser(currentUser);
        }
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function loginUser(credentials: LoginCredentials): Promise<void> {
    const response = await loginRequest(credentials);
    const accessToken = response.data.accessToken;
    const authenticatedUser = response.data.user;

    sessionStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(authenticatedUser);
  }

  async function logout(): Promise<void> {
    const currentToken = token;

    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);

    if (currentToken) {
      try {
        await logoutRequest(currentToken);
      } catch {
        // The local session is cleared even if the server request fails.
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
