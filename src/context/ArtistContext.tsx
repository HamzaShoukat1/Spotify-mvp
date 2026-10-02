import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type ArtistData = {
  name: string;
  artistType: string;
  genres: string;
  bio: string;
  profileImage: string;
  coverImage: string;
};

type ArtistContextValue = {
  artistData: ArtistData;
  updateArtist: (updates: Partial<ArtistData>) => void;
  resetArtist: () => void;
};

const initialArtistData: ArtistData = {
  name: '',
  artistType: '',
  genres: '',
  bio: '',
  profileImage: '',
  coverImage: '',
};

const ArtistContext = createContext<ArtistContextValue | undefined>(undefined);

export function ArtistProvider({ children }: { children: ReactNode }) {
  const [artistData, setArtistData] = useState(initialArtistData);

  const updateArtist = (updates: Partial<ArtistData>) => {
    setArtistData((current) => ({ ...current, ...updates }));
  };

  const resetArtist = () => setArtistData(initialArtistData);

  const value = useMemo(
    () => ({ artistData, updateArtist, resetArtist }),
    [artistData],
  );

  return <ArtistContext.Provider value={value}>{children}</ArtistContext.Provider>;
}

export function useArtistContext() {
  const context = useContext(ArtistContext);

  if (!context) {
    throw new Error('useArtistContext must be used inside ArtistProvider');
  }

  return context;
}