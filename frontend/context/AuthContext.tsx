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
  register as registerRequest,
  logout as logoutRequest,
} from "../src/features/authentication/services/auth_service";

import type {
  LoginCredentials,
  RegisterPayload,
  User,
} from "../src/features/authentication/types";

const TOKEN_KEY = "accessToken";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  registerUser: (payload: RegisterPayload) => Promise<void>;
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
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken || savedToken === "undefined") {
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
        localStorage.removeItem(TOKEN_KEY);
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
    const { token: accessToken, user: authenticatedUser } =
      await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(authenticatedUser);
  }

  async function registerUser(payload: RegisterPayload): Promise<void> {
    const { token: accessToken, user: newUser } =
      await registerRequest(payload);
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(newUser);
  }

  async function logout(): Promise<void> {
    const currentToken = token;
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);

    if (currentToken) {
      try {
        await logoutRequest(currentToken);
      } catch {}
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, loginUser, registerUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
