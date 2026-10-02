import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { FileMusic, UploadCloud } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useMusicContext } from "@/context/MusicContext";
import * as MediaLibrary from 'expo-media-library/legacy';

export default function MusicAudio() {
  const { musicDraft, updateMusic } = useMusicContext();
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const [error, setError] = useState("");

  const chooseAudio = async () => {
    if (status && !status.granted) {
      const permissionResponse = await requestPermission()
      // if (!permissionResponse.granted) {
      //   setError("Permission to access files was denied.");
      //   return;
      // }
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      setError("");
      updateMusic({ music: file.uri, fileName: file.name });
    }
  };



  const handleNext = () => {
    if (!musicDraft.music) {
      setError("Choose an audio file before continuing.");
      return;
    }

    router.push("/(root)/(music)/music-details");
  };

  return (
    <ArtistStepLayout
      step={1}
      totalSteps={3}
      title="Upload your track"
      description="Start with a high-quality audio file. MP3, WAV, and other audio formats are supported."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <TouchableOpacity
        onPress={chooseAudio}
        className="h-56 items-center justify-center rounded-2xl border border-dashed border-[#3D5C45] bg-[#142719] px-6"
      >
        <View className="rounded-full bg-[#1ED760] p-4">
          <UploadCloud size={28} color="#000000" />
        </View>
        <Text className="mt-4 text-lg font-black text-white">
          {musicDraft.fileName ? "Replace audio" : "Choose audio"}
        </Text>
        <Text className="mt-2 text-center text-sm text-[#A7A7A7]">
          Select a track from your device
        </Text>
      </TouchableOpacity>
      {musicDraft.fileName ? (
        <View className="mt-5 flex-row items-center rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 py-4">
          <FileMusic size={22} color="#1ED760" />
          <Text
            className="ml-3 flex-1 text-sm font-bold text-white"
            numberOfLines={1}
          >
            {musicDraft.fileName}
          </Text>
        </View>
      ) : null}
      {error ? (
        <Text className="mt-4 text-sm text-[#FF6B6B]">{error}</Text>
      ) : null}
    </ArtistStepLayout>
  );
}
