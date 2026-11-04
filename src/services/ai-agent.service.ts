import { ApiClient } from "@/api/ApiClient";
import { File } from "expo-file-system";

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000";

export type VoiceAgentPlaylist = {
  _id: string;
  name: string;
  owner?: string;
  songs?: Array<{
    _id: string;
    musicTitle: string;
    primaryArtistName: string;
    coverPhoto?: { url?: string };
  }>;
};

export type VoiceAgentResult = {
  chatSessionId: string;
  action: "none" | "created" | "added" | "removed" | "deleted";
  transcription: string;
  message: string;
  playlist: VoiceAgentPlaylist | null;
};

export async function processVoiceAgent(uri: string): Promise<VoiceAgentResult> {
  const formData = new FormData();
  formData.append("audio", new File(uri));

  return ApiClient(`${BackendUrl}/api/ai-agent/voice`, {
    method: "POST",
    body: formData,
  }) as Promise<VoiceAgentResult>;
}
