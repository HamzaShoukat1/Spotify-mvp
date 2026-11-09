import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  registerListening,
  
  type ListeningAccess,
} from "@/services/analytics.service";

type ListeningLimitContextValue = {
  playCount: number;
  isLimitReached: boolean;
  showUpgradeModal: boolean;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setListeningAccess: (access: ListeningAccess) => void;
  resetTrackRegistration: () => void;
  registerListeningAtHalf: (musicId: string) => Promise<void>;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
};

const ListeningLimitContext = createContext<
  ListeningLimitContextValue | undefined
>(undefined);

export function ListeningLimitProvider({ children }: { children: ReactNode }) {
  const [playCount, setPlayCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const registeredMusicIdRef = useRef<string | null>(null);

  const setListeningAccess = useCallback((access: ListeningAccess) => {
    setPlayCount(access.playCount ?? 0);
    setIsLimitReached(access.isLimitReached ?? false);
  }, []);

  const resetTrackRegistration = useCallback(() => {
    registeredMusicIdRef.current = null;
  }, []);

  const registerListeningAtHalf = useCallback(async (musicId: string) => {
    if (registeredMusicIdRef.current === musicId) return;

    registeredMusicIdRef.current = musicId;
    try {
      const registration = await registerListening(musicId);
      if (typeof registration.playCount === "number") {
        setPlayCount(registration.playCount);
      }
      if (registration.isLimitReached) setIsLimitReached(true);
    } catch (error) {
      registeredMusicIdRef.current = null;
      throw error;
    }
  }, []);

  const openUpgradeModal = useCallback(() => setShowUpgradeModal(true), []);
  const closeUpgradeModal = useCallback(() => setShowUpgradeModal(false), []);

  const value = useMemo(
    () => ({
      playCount,
      isLimitReached,
      showUpgradeModal,
      isLoading,
      setLoading: setIsLoading,
      setListeningAccess,
      resetTrackRegistration,
      registerListeningAtHalf,
      openUpgradeModal,
      closeUpgradeModal,
    }),
    [
      playCount,
      isLimitReached,
      showUpgradeModal,
      isLoading,
      setListeningAccess,
      resetTrackRegistration,
      registerListeningAtHalf,
      openUpgradeModal,
      closeUpgradeModal,
    ],
  );

  return (
    <ListeningLimitContext.Provider value={value}>
      {children}
    </ListeningLimitContext.Provider>
  );
}

export function useListeningLimit() {
  const context = useContext(ListeningLimitContext);

  if (!context) {
    throw new Error(
      "useListeningLimit must be used inside ListeningLimitProvider",
    );
  }

  return context;
}
