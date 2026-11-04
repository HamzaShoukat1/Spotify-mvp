import { ApiClient } from "@/api/ApiClient";

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000";
const API = `${BackendUrl}/api/ai`;

export type MusicDNAProfile = {
  headline: string;
  personality: string;
  topGenres: string[];
  topArtists: string[];
  listeningHabits: string[];
  surprisingInsight: string;
  recommendationDirections: string[];
};

export type MusicDNAResult = {
  profile: MusicDNAProfile;
  generatedAt: string;
  isCached: boolean;
  isLimitedData: boolean;
};

export const getMusicDNA = (refresh = false) =>
  ApiClient(`${API}/music-dna${refresh ? "?refresh=true" : ""}`) as Promise<MusicDNAResult>;
