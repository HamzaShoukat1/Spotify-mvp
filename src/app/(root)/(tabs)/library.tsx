import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { EllipsisVertical, Heart, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLikedSongs } from "@/hooks/use-like";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDeletePlaylist, useUserPlaylists } from "@/hooks/use-playlist";
import { FormSheetModal } from "@/components/FormSheetModel";
import type { Playlist } from "@/services/playlist.service";

const LIBRARY_ITEMS = [
  {
    id: "1",
    title: "Liked Songs",
    customIcon: "heart",
    route: "UserlikedArtistdetails",
  },
];

const FILTER_TAGS = ["Artists"];

export default function Library() {
  const {
    data: UserDetails,
    isLoading: isUserLoading,
    refetch: refetchUser,
    isRefetching: isUserRefetching,
  } = useCurrentUser();
  const router = useRouter();
  const userName = UserDetails?.name?.trim() || "U";
  const userInitial = userName.charAt(0).toUpperCase();
  const {
    data: likedSongs,
    isLoading: isSongsLoading,
    refetch: refetchSongs,
    isRefetching: isSongsRefetching,
  } = useLikedSongs();
  const likedSongsCount = likedSongs?.length ?? 0;
  const {
    data: playlists = [],
    refetch: refetchPlaylists,
    isRefetching: isPlaylistsRefetching,
  } = useUserPlaylists();
  const deletePlaylist = useDeletePlaylist();
  const [playlistToManage, setPlaylistToManage] = useState<Playlist | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePlaylistError, setDeletePlaylistError] = useState("");

  const closePlaylistSheets = () => {
    if (deletePlaylist.isPending) return;
    setPlaylistToManage(null);
    setShowDeleteConfirmation(false);
    setDeletePlaylistError("");
  };

  const isLoading = isUserLoading || isSongsLoading;

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full"
      >
        <View className="flex-row items-center justify-between px-4 pt-4">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(root)/(screens)/Edit-Profile")}
              className="w-9 h-9 items-center justify-center rounded-full bg-[#1DB954]"
            >
              <Text className="text-black text-[15px] font-bold uppercase">
                {userInitial}
              </Text>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold tracking-tight">
              Your Library
            </Text>
          </View>
        </View>

        <View className="mt-5 mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {FILTER_TAGS.map((tag, index) => (
              <TouchableOpacity
                key={index}
                className="bg-[#2a2a2a] px-4 py-2 rounded-full"
                activeOpacity={0.8}
              >
                <Text className="text-white text-[13px] font-medium">
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={
                isUserRefetching || isSongsRefetching || isPlaylistsRefetching
              }
              onRefresh={() => {
                refetchUser();
                refetchSongs();
                refetchPlaylists();
              }}
              tintColor="#1DB954"
              colors={["#1DB954"]}
              progressBackgroundColor="#282828"
            />
          }
        >
          {LIBRARY_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-2"
              activeOpacity={0.6}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                }
              }}
            >
              <View className="mr-4">
                {item.customIcon === "heart" ? (
                  <View className="w-[64px] h-[64px] rounded bg-gradient-to-br from-[#450e74] to-[#5b3bb4] items-center justify-center bg-[#3c2bc1]">
                    <Heart color="#ffffff" size={24} fill="#ffffff" />
                  </View>
                ) : (
                  <View className="w-[64px] h-[64px] bg-[#282828] items-center justify-center rounded">
                    <Heart color="#a7a7a7" size={22} />
                  </View>
                )}
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-white text-[16px] font-semibold tracking-wide">
                  {item.title}
                </Text>

                <View className="flex-row items-center mt-0.5">
                  <Text className="text-[#a7a7a7] text-[13px] font-medium">
                    {item.id === "1"
                      ? `${isLoading ? "—" : `${likedSongsCount} ${likedSongsCount === 1 ? "song" : "songs"}`}`
                      : ""}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View className="mb-3 mt-7 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Your playlists</Text>
            <TouchableOpacity
              className="p-3"
              onPress={() => router.push("/(root)/(screens)/Create-Playlist")}
            >
              <Plus color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          {playlists.length === 0 ? (
            <Text className="py-4 text-sm text-[#a7a7a7]">
              Your playlists will show up here.
            </Text>
          ) : (
            playlists.map((playlist) => {
              const cover = playlist.songs?.[0]?.coverPhoto?.url;
              return (
                <View key={playlist._id} className="mb-2 flex-row items-center">
                  <TouchableOpacity
                    className="flex-1 flex-row items-center py-2"
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                        pathname: "/(root)/(screens)/Playlist-Detail",
                        params: { id: playlist._id },
                      })
                    }
                  >
                    {cover ? (
                      <Image
                        source={{ uri: cover }}
                        className="h-14 w-14 rounded bg-[#282828]"
                      />
                    ) : (
                      <View className="h-14 w-14 items-center justify-center rounded bg-[#282828]">
                        <Text className="text-2xl text-[#aaa]">♫</Text>
                      </View>
                    )}
                    <View className="ml-4 flex-1">
                      <Text
                        numberOfLines={1}
                        className="font-semibold text-white"
                      >
                        {playlist.name}
                      </Text>
                      <Text className="mt-1 text-xs text-white">
                        Playlist · {playlist.songs.length}{" "}
                        {playlist.songs.length === 1 ? "song" : "songs"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-3"
                    onPress={() => {
                      setPlaylistToManage(playlist);
                      setDeletePlaylistError("");
                    }}
                  >
                    <EllipsisVertical color="#aaa" size={22} />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <FormSheetModal
        visible={!!playlistToManage && !showDeleteConfirmation}
        title="Playlist options"
        onClose={closePlaylistSheets}
      >
        <Text className="mb-5 text-center text-sm text-neutral-400" numberOfLines={2}>
          {playlistToManage?.name}
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (!playlistToManage) return;
            const id = playlistToManage._id;
            closePlaylistSheets();
            router.push({ pathname: "/(root)/(screens)/Playlist-Detail", params: { id } });
          }}
          className="mb-3 w-full items-center rounded-full bg-[#2a2a2a] py-4"
        >
          <Text className="font-bold text-white">Open playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            setDeletePlaylistError("");
            setShowDeleteConfirmation(true);
          }}
          className="w-full items-center rounded-full bg-red-600 py-4"
        >
          <Text className="font-bold text-white">Delete playlist</Text>
        </TouchableOpacity>
      </FormSheetModal>

      <FormSheetModal
        visible={!!playlistToManage && showDeleteConfirmation}
        title="Delete playlist?"
        onClose={closePlaylistSheets}
      >
        <Text className="mb-5 text-center text-sm leading-5 text-neutral-400">
          “{playlistToManage?.name}” will be deleted
        </Text>
        {deletePlaylistError ? (
          <Text accessibilityRole="alert" className="mb-4 text-center text-sm text-red-400">
            {deletePlaylistError}
          </Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={deletePlaylist.isPending || !playlistToManage}
          onPress={() => {
            if (!playlistToManage || deletePlaylist.isPending) return;
            deletePlaylist.mutate(playlistToManage._id, {
              onSuccess: () => {
                setPlaylistToManage(null);
                setShowDeleteConfirmation(false);
                setDeletePlaylistError("");
              },
              onError: (error) => setDeletePlaylistError(error.message),
            });
          }}
          className="w-full items-center justify-center rounded-full bg-red-600 py-4"
        >
          {deletePlaylist.isPending ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="font-bold text-white">Delete playlist</Text>
          )}
        </TouchableOpacity>
      </FormSheetModal>
    </SafeAreaView>
  );
}
