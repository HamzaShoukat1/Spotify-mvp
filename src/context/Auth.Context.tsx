import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";

import { getAccessToken } from "@/storage/secureStorage";

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  refreshAuth: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await getAccessToken();
      setUserToken(token);
    } catch (error) {refreshAuth
      console.error("Failed to load access token:", error);
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ userToken, isLoading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}