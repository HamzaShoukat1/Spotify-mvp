import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type AlbumTrackDraft = {
  id: string;
  uri: string;
  fileName: string;
  mimeType?: string;
  title: string;
};

export type AlbumDraft = {
  albumTitle: string;
  artistName: string;
  coverPhoto: string;
  tracks: AlbumTrackDraft[];
};

type AlbumContextValue = {
  albumDraft: AlbumDraft;
  updateAlbum: (updates: Partial<AlbumDraft>) => void;
  addTracks: (tracks: AlbumTrackDraft[]) => void;
  updateTrack: (id: string, updates: Partial<AlbumTrackDraft>) => void;
  removeTrack: (id: string) => void;
  resetAlbum: () => void;
};

const initialAlbumDraft: AlbumDraft = {
  albumTitle: "",
  artistName: "",
  coverPhoto: "",
  tracks: [],
};
const AlbumContext = createContext<AlbumContextValue | undefined>(undefined);

export function AlbumProvider({ children }: { children: ReactNode }) {
  const [albumDraft, setAlbumDraft] = useState(initialAlbumDraft);
  const updateAlbum = (updates: Partial<AlbumDraft>) =>
    setAlbumDraft((current) => ({ ...current, ...updates }));
  const addTracks = (tracks: AlbumTrackDraft[]) =>
    setAlbumDraft((current) => ({
      ...current,
      tracks: [...current.tracks, ...tracks],
    }));
  const updateTrack = (id: string, updates: Partial<AlbumTrackDraft>) =>
    setAlbumDraft((current) => ({
      ...current,
      tracks: current.tracks.map((track) =>
        track.id === id ? { ...track, ...updates } : track,
      ),
    }));
  const removeTrack = (id: string) =>
    setAlbumDraft((current) => ({
      ...current,
      tracks: current.tracks.filter((track) => track.id !== id),
    }));
  const resetAlbum = () => setAlbumDraft(initialAlbumDraft);
  const value = { albumDraft, updateAlbum, addTracks, updateTrack, removeTrack, resetAlbum };
  return (
    <AlbumContext.Provider value={value}>{children}</AlbumContext.Provider>
  );
}

export function useAlbumContext() {
  const context = useContext(AlbumContext);
  if (!context)
    throw new Error("useAlbumContext must be used inside AlbumProvider");
  return context;
}
