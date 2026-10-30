import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, EllipsisVertical, Pencil, Plus } from "lucide-react-native";
import {
  usePlaylist,
  usePlaylistSongMutation,
  useRenamePlaylist,
} from "@/hooks/use-playlist";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormSheetModal } from "@/components/FormSheetModel";
import type { PlaylistSong } from "@/services/playlist.service";

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: playlist, isLoading, isError } = usePlaylist(id);
  const removeSong = usePlaylistSongMutation(id, false);
  const renameMutation = useRenamePlaylist();
  const [renameOpen, setRenameOpen] = useState(false);
  const [name, setName] = useState("");
  const [songToRemove, setSongToRemove] = useState<PlaylistSong | null>(null);
  const [removeSongError, setRemoveSongError] = useState("");

  const handleRenameTrigger = () => {
    setName(playlist?.name ?? "");
    setRenameOpen(true);
  };

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator color="#1ed760" size="large" />
      </View>
    );

  if (isError || !playlist)
    return (
      <View className="flex-1 items-center justify-center bg-[#121212] px-6">
        <Text className="text-center font-medium text-neutral-400">Could not load playlist.</Text>
        <TouchableOpacity
          className="mt-4 rounded-full border border-neutral-700 px-6 py-2.5"
          onPress={() => router.back()}
        >
          <Text className="font-semibold text-[#1ed760]">Go back</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView
        className="absolute top-0 left-0 right-0 z-50 bg-[#121212]/85 backdrop-blur-md"
        edges={["top"]}
        
      >
        <View className="flex-row items-center justify-between px-5 py-3">
          <TouchableOpacity
            className="p-2 rounded-full bg-black/25"
            onPress={() => {
              router.back();
            }}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="w-10 h-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingTop: 120, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        
      >
        {/* Header/Hero Section */}
        <View className="items-center px-6">


          <TouchableOpacity
            onPress={handleRenameTrigger}
            className="mt-6 flex-row items-center justify-center relative px-4 active:opacity-70"
          >
            <Text numberOfLines={2} className="text-center text-6xl font-bold tracking-tight text-white max-w-[85%]">
              {playlist.name}
            </Text>
            <Pencil color="#1ed760" size={20} className="absolute " />
          </TouchableOpacity>

          <Text className="mt-1.5 text-center text-xs font-medium text-neutral-400 tracking-wide uppercase">
            {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
          </Text>

          {/* Action Button Row */}
          <View className="mt-6 w-full flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(root)/(screens)/Select-Playlist-Songs",
                  params: { id },
                })
              }
              className="flex-row items-center justify-center rounded-full bg-[#1ed760] px-8 py-3.5 shadow-md active:scale-95 transition-transform"
            >
              <Plus color="black" size={18} strokeWidth={2.5} />
              <Text className="ml-2 text-sm font-bold text-black tracking-wide">
                Add to this playlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8 px-5">
          {playlist.songs.length === 0 ? (
            <View className="items-center justify-center rounded-2xl px-6 py-10">
              <Text className="text-lg font-bold text-white tracking-tight">
                Let’s find something to play
              </Text>
              <Text className="mt-2 text-center text-sm leading-relaxed text-neutral-400 max-w-[240px]">
                Add songs to make this playlist yours.
              </Text>
            </View>
          ) : (
            playlist.songs.map((song) => (
              <View key={song._id} className="mb-4 flex-row items-center justify-between py-1">
                <View className="flex-1 flex-row items-center mr-4">
                  <TouchableOpacity
                    className="flex-1 flex-row items-center active:opacity-70"
                    onPress={() => router.push({
                      pathname: "/Track-View",
                      params: { musicId: song._id },
                    })}
                  >
                    {song.coverPhoto?.url ? (
                      <Image source={{ uri: song.coverPhoto.url }} className="h-12 w-12 rounded bg-[#242424]" />
                    ) : (
                      <View className="h-12 w-12 rounded bg-[#242424]" />
                    )}
                    <View className="ml-3 flex-1 justify-center">
                      <Text numberOfLines={1} className="font-semibold text-sm text-white tracking-wide">
                        {song.musicTitle}
                      </Text>
                      <Text numberOfLines={1} className="mt-0.5 text-xs font-medium text-neutral-400">
                        {song.primaryArtistName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="p-2 -mr-2"
                  disabled={removeSong.isPending}
                  onPress={() => {
                    if (removeSong.isPending) return;
                    setRemoveSongError("");
                    setSongToRemove(song);
                  }}
                >
                  <EllipsisVertical color="#b3b3b3" size={18} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <FormSheetModal
        visible={renameOpen}
        title="Rename playlist"
        onClose={() => setRenameOpen(false)}
        liftOnKeyboard
      >
        <TextInput
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={100}
          placeholder="Enter playlist name"
          placeholderTextColor="#737373"
          className="mt-2 mb-6 rounded-xl bg-[#333333] px-4 py-3.5 text-base font-medium text-white border border-neutral-700/50 focus:border-[#1ed760]"
        />

        <TouchableOpacity
          className="w-full rounded-full bg-[#1ed760] py-4 items-center justify-center shadow-md active:opacity-90"
          disabled={renameMutation.isPending || !name.trim()}
          onPress={() => {
            if (!name.trim()) return;
            renameMutation.mutate(
              { id, name: name.trim() },
              {
                onSuccess: () => setRenameOpen(false),
                onError: (e) => Alert.alert("Could not rename", e.message),
              }
            );
          }}
        >
          <Text className="text-black text-sm font-bold tracking-wider uppercase">
            {renameMutation.isPending ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </FormSheetModal>

      <FormSheetModal
        visible={!!songToRemove}
        title="Remove song from playlist?"
        onClose={() => {
          if (removeSong.isPending) return;
          setSongToRemove(null);
          setRemoveSongError("");
        }}
      >
        <Text className="mb-5 text-center text-sm leading-5 text-neutral-400">
          Remove “{songToRemove?.musicTitle || "this song"}” from “{playlist.name}”?
        </Text>
        {removeSongError ? (
          <Text accessibilityRole="alert" className="mb-4 text-center text-sm text-red-400">
            {removeSongError}
          </Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={removeSong.isPending}
          onPress={() => {
            if (!songToRemove || removeSong.isPending) return;
            removeSong.mutate(
              { songId: songToRemove._id },
              {
                onSuccess: () => {
                  setSongToRemove(null);
                  setRemoveSongError("");
                },
                onError: (error) => setRemoveSongError(error.message),
              },
            );
          }}
          className="w-full items-center justify-center rounded-full bg-red-600 py-4"
        >
          {removeSong.isPending ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-sm font-bold uppercase tracking-wider text-white">Remove song</Text>
          )}
        </TouchableOpacity>
      </FormSheetModal>
    </View>


  );
}
