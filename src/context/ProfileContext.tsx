import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ArtistProfile } from "@/services/artist.service";

type ProfileContextValue = {
  profile: ArtistProfile | null;
  setProfile: (profile: ArtistProfile | null) => void;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const value = useMemo(() => ({ profile, setProfile }), [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfileContext must be used inside ProfileProvider");
  }

  return context;
}