import { useState } from "react";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Check, FileMusic, Globe2, Mic2, Music2 } from "lucide-react-native";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useMusicContext } from "@/context/MusicContext";
import { useCreateMusic } from "@/hooks/useArtist";

export default function MusicReview() {
  const { musicDraft, resetMusic } = useMusicContext();
  const { mutateAsync, error } = useCreateMusic();

  const publishTrack = async () => {


    try {
      await mutateAsync({
        music: musicDraft.music,
        musicTitle: musicDraft.musicName,
        primaryArtistName: musicDraft.artistName,
        Genre: musicDraft.genre,
        Language: musicDraft.language,
      });
      resetMusic();
      router.replace("/(root)/(screens)/Artist-hub");
    } catch (publishError) {
      Alert.alert(
        "Unable to publish track",
        publishError instanceof Error
          ? publishError.message
          : "Please try again.",
      );
    } 
  };


  return (
    <ArtistStepLayout
      step={3}
      totalSteps={3}
      title="Review your track"
      description="Make sure everything looks right before publishing."
      onBack={() => router.back()}
      onNext={publishTrack}
    
    >
      <View className="mb-6 items-center rounded-2xl border border-[#285B38] bg-[#142719] px-5 py-7">
        <View className="mb-4 rounded-full bg-[#1ED760] p-4">
          <Check size={28} color="#000000" strokeWidth={3} />
        </View>
        <Text className="text-lg font-black text-white">Ready to release</Text>
        <Text className="mt-2 text-center text-sm text-[#A7A7A7]">
          Your track will be available in your Artist Hub.
        </Text>
      </View>
      <View className="overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]">
        <View className="flex-row items-center border-b border-[#303030] px-4 py-4">
          <View className="mr-3 rounded-full bg-[#303030] p-2">
            <Music2 size={18} color="#1ED760" />
          </View>
          <View className="flex-1">
            <Text className="text-xs uppercase tracking-[1px] text-[#777777]">
              Track
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {musicDraft.musicName}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center border-b border-[#303030] px-4 py-4">
          <View className="mr-3 rounded-full bg-[#303030] p-2">
            <Mic2 size={18} color="#1ED760" />
          </View>
          <View className="flex-1">
            <Text className="text-xs uppercase tracking-[1px] text-[#777777]">
              Artist
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {musicDraft.artistName}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center border-b border-[#303030] px-4 py-4">
          <View className="mr-3 rounded-full bg-[#303030] p-2">
            <Globe2 size={18} color="#1ED760" />
          </View>
          <View className="flex-1">
            <Text className="text-xs uppercase tracking-[1px] text-[#777777]">
              Genre and language
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {musicDraft.genre} · {musicDraft.language}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center px-4 py-4">
          <View className="mr-3 rounded-full bg-[#303030] p-2">
            <FileMusic size={18} color="#1ED760" />
          </View>
          <View className="flex-1">
            <Text className="text-xs uppercase tracking-[1px] text-[#777777]">
              Audio file
            </Text>
            <Text
              className="mt-1 text-base font-bold text-white"
              numberOfLines={1}
            >
              {musicDraft.fileName}
            </Text>
          </View>
        </View>
      </View>
      {error ? (
        <Text className="mt-4 text-center text-sm text-[#FF6B6B]">
          {error instanceof Error ? error.message : "Unable to publish track."}
        </Text>
      ) : null}
    </ArtistStepLayout>
  );
}
