import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";

import { getAccessToken } from "@/storage/secureStorage";
import { completeOnboarding, currectUser } from "@/services/auth.service";

type AuthContextType = {
  userToken: string | null;
  onboarding: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  finishOnboarding: (favoriteArtists: string[]) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  onboarding: true,
  isLoading: true,
  refreshAuth: async () => { },
  finishOnboarding: async () => { },
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        const user = await currectUser();
        setUserToken(token);
        setOnboarding(Boolean(user?.onboarding));
      } else {
        setUserToken(null);
        setOnboarding(false);
      }
    } catch (error) {
      console.error("Failed to load access token:", error);
      setUserToken(null);
      setOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const finishOnboarding = useCallback(async (favoriteArtists: string[]) => {
    const user = await completeOnboarding(favoriteArtists);
    setOnboarding(Boolean(user?.onboarding));
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ userToken, onboarding, isLoading, refreshAuth, finishOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}