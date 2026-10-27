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
import { ArrowLeft, EllipsisVertical, Pencil, Plus, X } from "lucide-react-native";
import {
  useDeletePlaylist,
  usePlaylist,
  usePlaylistSongMutation,
  useRenamePlaylist,
} from "@/hooks/use-playlist";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormSheetModal } from "@/components/FormSheetModel";

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: playlist, isLoading, isError } = usePlaylist(id);
  const removeSong = usePlaylistSongMutation(id, false);
  const deleteMutation = useDeletePlaylist();
  const renameMutation = useRenamePlaylist();
  const [renameOpen, setRenameOpen] = useState(false);
  const [name, setName] = useState("");

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

  const cover = playlist.songs?.[0]?.coverPhoto?.url;

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

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(root)/(screens)/Track-View',
                    params: { musicId: song?._id },
                  })
                }
                key={song._id} className="mb-4 flex-row items-center justify-between py-1 active:opacity-70">
                <View className="flex-1 flex-row items-center mr-4">
                  {song.coverPhoto?.url ? (
                    <Image
                      source={{ uri: song.coverPhoto.url }}
                      className="h-12 w-12 rounded bg-[#242424]"
                    />
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
                </View>

                <TouchableOpacity
                  className="p-2 -mr-2"
                  disabled={removeSong.isPending}
                  onPress={() => {
                    if (removeSong.isPending) return;

                    Alert.alert(
                      "Remove from Playlist?",
                      `Are you sure you want to remove "${song.musicTitle || 'this song'}"?`,
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Remove",
                          style: "destructive",
                          onPress: () => {
                            removeSong.mutate(
                              { songId: song._id },
                              {
                                onError: (error) =>
                                  Alert.alert("Could not remove song", error.message),
                              },
                            );
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <EllipsisVertical color="#b3b3b3" size={18} />
                </TouchableOpacity>

              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <FormSheetModal
        visible={renameOpen}
        title="Rename playlist"
        onClose={() => setRenameOpen(false)}
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
    </View>


  );
}
