import { useEffect, useState } from "react";
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { router } from "expo-router";
import { Mic, Square, Sparkles } from "lucide-react-native";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVoiceAgent } from "@/hooks/use-ai-agent";

export default function VoiceAgentPage() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const agent = useVoiceAgent();
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync().then(({ granted }) => {
      setPermissionDenied(!granted);
    });
    setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }).catch(() => {
      setError("Could not prepare the microphone.");
    });
  }, []);

  const startRecording = async () => {
    setError(null);
    agent.reset();
    if (permissionDenied) {
      setError("Microphone permission is required.");
      return;
    }
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setError("Could not start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri ?? recorder.getStatus().url;
      if (!uri) {
        setError("The recording could not be saved. Please try again.");
        return;
      }
      agent.mutate(uri, {
        onError: (requestError) => setError(requestError.message),
      });
    } catch {
      setError("Could not finish the recording.");
    }
  };

  const isRecording = recorderState.isRecording;
  const isBusy = agent.isPending;
  const duration = Math.floor(recorderState.durationMillis / 1000);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-5">
        <TouchableOpacity onPress={() => router.back()} className="mb-12 self-start">
          <Text className="text-base text-[#A7A7A7]">Close</Text>
        </TouchableOpacity>
        <View className="items-center">
          <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-[#1B1B1B]">
            <Sparkles color="#1DB954" size={28} />
          </View>
          <Text className="text-3xl font-bold text-white">Voice playlist</Text>
          <Text className="mt-3 text-center text-base leading-6 text-[#A7A7A7]">
            Tell me what you want to hear, and I will find it in your catalogue.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isBusy}
            className={`h-28 w-28 items-center justify-center rounded-full ${isRecording ? "bg-[#E22134]" : "bg-[#1DB954]"}`}
          >
            {isBusy ? <ActivityIndicator color="#000" size="large" /> : isRecording ? <Square color="#fff" fill="#fff" size={30} /> : <Mic color="#000" size={36} />}
          </TouchableOpacity>
          <Text className="mt-5 text-sm font-semibold text-[#A7A7A7]">
            {isBusy ? "Thinking..." : isRecording ? `${duration}s  Tap to stop` : "Tap to speak"}
          </Text>
        </View>

        {permissionDenied && <Text className="mb-3 text-center text-[#E22134]">Microphone permission was denied.</Text>}
        {error && <Text className="mb-3 text-center text-[#E22134]">{error}</Text>}
       {agent?.data && (
  <View className="mb-4 rounded-2xl border border-neutral-800 bg-[#121212] p-5 shadow-xl">
    {/* User Speech Section */}
    <View className="mb-4 border-b border-neutral-800 pb-3">
      <Text className="text-[10px] font-bold uppercase tracking-widest text-[#1DB954]">
        You said
      </Text>
      <Text className="mt-1 text-base font-medium italic text-neutral-300">
        "{agent.data.transcription}"
      </Text>
    </View>

    {/* AI Response Section */}
    <View>
      <Text className="text-base leading-6 text-neutral-200">
        {agent.data.message}
      </Text>
    </View>

    {/* Playlist Action Button */}
    {agent.data.playlist && (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => router.push({ 
          pathname: "/(root)/(screens)/Playlist-Detail", 
          params: { id: agent.data.playlist?._id } 
        })}
        className="mt-5 flex-row items-center justify-between rounded-xl bg-neutral-800/60 p-3.5 border border-neutral-700/30 active:bg-neutral-800"
      >
        <View className="flex-row items-center flex-1 pr-3">
          <Text className="text-base mr-2.5">🎵</Text> 
          <Text className="font-semibold text-white text-sm numberOfLines={1}">
            Open {agent.data.playlist.name}
          </Text>
        </View>
        <Text className="text-xs font-bold text-[#1DB954]">VIEW →</Text>
      </TouchableOpacity>
    )}
  </View>
)}

      </View>
    </SafeAreaView>
  );
}
