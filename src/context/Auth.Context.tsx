import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";

import { getAccessToken } from "@/storage/secureStorage";
import { completeOnboarding, currectUser } from "@/services/auth.service";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  role: "user" | "artist" | "admin";
  onboarding: boolean;
  stripeCustomerId?: string | null;
  planTier: "free" | "premium";
  favoriteArtists?: string[];
}

export type AuthContextType = {
  userToken: string | null;
  user: AuthUser | null;
  isPremium: boolean;
  planTier: "free" | "premium";
  onboarding: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  finishOnboarding: (favoriteArtists: string[]) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  user: null,
  isPremium: false,
  planTier: "free",
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshRequestId = useRef(0);

  const isPremium = user?.planTier === "premium";
  const planTier = user?.planTier === "premium" ? "premium" : "free";

  const refreshAuth = useCallback(async () => {
    const requestId = ++refreshRequestId.current;
    try {
      const token = await getAccessToken();
      if (requestId !== refreshRequestId.current) return;

      if (token) {
        const currentUser = await currectUser();
        if (requestId !== refreshRequestId.current) return;
        if (!currentUser) throw new Error("Current user data was not returned.");

        setUser(currentUser);
        setOnboarding(Boolean(currentUser?.onboarding));
        setUserToken(token);
      } else {
        setUserToken(null);
        setUser(null);
        setOnboarding(false);
      }
    } catch (error) {
      if (requestId === refreshRequestId.current) {
        console.error("Failed to refresh user auth state:", error);
        setUserToken(null);
        setUser(null);
        setOnboarding(false);
      }
    } finally {
      if (requestId === refreshRequestId.current) setIsLoading(false);
    }
  }, []);

  const finishOnboarding = useCallback(async (favoriteArtists: string[]) => {
    const updatedUser = await completeOnboarding(favoriteArtists);
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
    setOnboarding(Boolean(updatedUser?.onboarding));
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        isPremium,
        planTier,
        onboarding,
        isLoading,
        refreshAuth,
        finishOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
