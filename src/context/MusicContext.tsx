import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type MusicDraft = {
  music: string;
  musicName: string;
  artistName: string;
  genre: string;
  language: string;
  fileName: string;
};

type MusicContextValue = {
  musicDraft: MusicDraft;
  updateMusic: (updates: Partial<MusicDraft>) => void;
  resetMusic: () => void;
};

const initialMusicDraft: MusicDraft = {
  music: '',
  musicName: '',
  artistName: '',
  genre: '',
  language: '',
  fileName: '',
};

const MusicContext = createContext<MusicContextValue | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicDraft, setMusicDraft] = useState(initialMusicDraft);

  const updateMusic = (updates: Partial<MusicDraft>) => {
    setMusicDraft((current) => ({ ...current, ...updates }));
  };

  const resetMusic = () => setMusicDraft(initialMusicDraft);

  const value = useMemo(
    () => ({ musicDraft, updateMusic, resetMusic }),
    [musicDraft],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusicContext() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error('useMusicContext must be used inside MusicProvider');
  }

  return context;
}