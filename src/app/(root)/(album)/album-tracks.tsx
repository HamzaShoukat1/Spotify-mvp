import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { FileMusic, Plus, Trash2 } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useAlbumContext } from "@/context/AlbumContext";

export default function AlbumTracks() {
  const { albumDraft, addTracks, updateTrack, removeTrack } = useAlbumContext();
  const [error, setError] = useState("");

  const chooseTracks = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    addTracks(result.assets.map((file, index) => ({
      id: `${file.uri}-${Date.now()}-${index}`,
      uri: file.uri,
      fileName: file.name,
      mimeType: file.mimeType,
      title: "",
    })));
    setError("");
  };

  const handleNext = () => {
    if (!albumDraft.tracks.length || albumDraft.tracks.some((track) => !track.title.trim())) {
      setError("Add at least one audio file and a title for every track.");
      return;
    }
    router.push("/(root)/(album)/album-review");
  };

  return (
    <ArtistStepLayout
      step={2}
      totalSteps={3}
      title="Add your tracks"
      description="Choose multiple audio files, then edit their titles before release."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <TouchableOpacity
        onPress={chooseTracks}
        className="mb-5 flex-row items-center justify-center rounded-xl bg-[#1ED760] px-4 py-4"
      >
        <Plus size={20} color="#000" strokeWidth={3} />
        <Text className="ml-2 font-black text-black">Add music files</Text>
      </TouchableOpacity>
      {albumDraft.tracks.length ? (
        <View className="overflow-hidden rounded-xl border border-[#282828] bg-[#181818]">
          <View className="flex-row items-center justify-between border-b border-[#303030] bg-[#202020] px-4 py-3">
            <Text className="text-[11px] font-bold uppercase tracking-[1px] text-[#B3B3B3]">Tracklist</Text>
            <Text className="text-xs text-[#777]">{albumDraft.tracks.length} {albumDraft.tracks.length === 1 ? "track" : "tracks"}</Text>
          </View>
          {albumDraft.tracks.map((track, index) => (
            <View key={track.id} className="border-b border-[#282828] px-4 py-4 last:border-b-0">
              <View className="flex-row items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/15">
                  <Text className="text-sm font-bold text-[#1DB954]">{index + 1}</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="mb-1 text-[10px] font-bold uppercase tracking-[1px] text-[#777]">Audio file</Text>
                  <View className="flex-row items-center">
                    <FileMusic size={15} color="#1DB954" />
                    <Text className="ml-2 flex-1 text-xs font-mono text-[#D9D9D9]" numberOfLines={1}>{track.fileName}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeTrack(track.id)}
                  accessibilityLabel={`Delete ${track.fileName}`}
                  className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-[#3A1F22]"
                >
                  <Trash2 size={16} color="#E85D5D" />
                </TouchableOpacity>
              </View>
              <View className="mt-4">
                <Text className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-[#777]">Song title</Text>
                <TextInput
                  value={track.title}
                  onChangeText={(title) => updateTrack(track.id, { title })}
                  className="h-11 rounded-lg border border-[#383838] bg-[#242424] px-3 text-sm text-white"
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center rounded-2xl border border-dashed border-[#3D5C45] bg-[#142719] px-6 py-12">
          <FileMusic size={34} color="#1ED760" />
          <Text className="mt-4 text-base font-bold text-white">No tracks selected yet</Text>
          <Text className="mt-2 text-center text-sm text-[#A7A7A7]">Select several songs from your device to build the tracklist.</Text>
        </View>
      )}
      {error ? <Text className="mt-4 text-sm text-[#FF6B6B]">{error}</Text> : null}
    </ArtistStepLayout>
  );
}