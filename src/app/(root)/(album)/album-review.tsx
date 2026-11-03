import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Check, FileMusic } from "lucide-react-native";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useAlbumContext } from "@/context/AlbumContext";
import { useCreateAlbum } from "@/hooks/use-album";
import { FormSheetModal } from "@/components/FormSheetModel";

export default function AlbumReview() {
  const { albumDraft, resetAlbum } = useAlbumContext();
  const { mutateAsync: publish, isPending: uploading } = useCreateAlbum();
  const [progress, setProgress] = useState(0);

  const publishAlbum = async () => {
    setProgress(0);
    try {
      const album = await publish({
        draft: albumDraft,
        onProgress: setProgress,
      });
      resetAlbum();
      router.replace({
        pathname: "/(root)/(screens)/Album-View",
        params: { albumId: album._id },
      });
    } catch (error) {
      Alert.alert(
        "Unable to publish album",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  return (
    <>
      <ArtistStepLayout
        step={3}
        totalSteps={3}
        title="Review and release"
        description="Your album is ready. Check the details once, then publish it for listeners."
        onBack={() => router.back()}
        onNext={publishAlbum}
        nextLabel="Add Album"
        isPending={uploading}
      >
        <View className="mb-6 flex-row items-center rounded-2xl border border-[#285B38] bg-[#142719] p-4">
          <Image
            source={{ uri: albumDraft.coverPhoto }}
            className="h-24 w-24 rounded-lg bg-[#203B27]"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1">
            <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#8FC99D]">
              Ready to release
            </Text>
            <Text
              className="mt-2 text-xl font-black text-white"
              numberOfLines={2}
            >
              {albumDraft.albumTitle}
            </Text>
            <Text className="mt-1 text-sm text-[#A7A7A7]" numberOfLines={1}>
              {albumDraft.artistName}
            </Text>
            <View className="mt-2 flex-row items-center">
              <View className="mr-2 rounded-full bg-[#1ED760] p-1">
                <Check size={11} color="#000" strokeWidth={3} />
              </View>
              <Text className="text-xs font-semibold text-[#C6E8CD]">
                {albumDraft.tracks.length}{" "}
                {albumDraft.tracks.length === 1 ? "track" : "tracks"}
              </Text>
            </View>
          </View>
        </View>
        <View className="overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]">
          <View className="flex-row items-center justify-between border-b border-[#303030] bg-[#202020] px-4 py-3">
            <Text className="text-[11px] font-bold uppercase tracking-[1px] text-[#B3B3B3]">
              Tracklist
            </Text>
            <Text className="text-xs text-[#777]">Final order</Text>
          </View>
          {albumDraft.tracks.map((track, index) => (
            <View
              key={track.id}
              className="flex-row items-center border-b border-[#303030] px-4 py-4 last:border-b-0"
            >
              <Text className="w-8 text-sm font-semibold text-[#777]">
                {String(index + 1).padStart(2, "0")}
              </Text>
              <FileMusic size={17} color="#1DB954" />
              <View className="ml-3 flex-1">
                <Text
                  className="text-sm font-bold text-white"
                  numberOfLines={1}
                >
                  {track.title}
                </Text>
                <Text className="mt-1 text-xs text-[#777]" numberOfLines={1}>
                  {track.fileName}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ArtistStepLayout>
      <FormSheetModal
        visible={uploading}
        title="Publishing album"
        onClose={() => undefined}
        dismissible={false}
      >
        <View className="w-full items-center">
          <ActivityIndicator size="large" color="#1ED760" />
          <Text className="mt-5 text-center text-xl font-black text-white">
            {progress >= 99 ? "Finishing album..." : "Uploading..."}
          </Text>
          <Text className="mt-2 text-center text-sm text-[#A7A7A7]">
            {progress >= 99
              ? "The files are uploaded. We are saving your album now."
              : "Please wait while your album is uploaded."}
          </Text>
          <View className="mt-7 h-2 w-full overflow-hidden rounded-full bg-[#303030]">
            <View
              className="h-full bg-[#1ED760]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </View>
          <Text className="mt-3 text-lg font-bold text-[#1ED760]">
            {Math.min(100, Math.max(0, progress))}%
          </Text>
        </View>
      </FormSheetModal>
    </>
  );
}
