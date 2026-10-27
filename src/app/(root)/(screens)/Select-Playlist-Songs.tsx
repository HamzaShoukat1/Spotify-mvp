import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check, Plus, Search, X } from "lucide-react-native";
import {
  useAvailableSongs,
  usePlaylist,
  usePlaylistSongMutation,
} from "@/hooks/use-playlist";

export default function SelectPlaylistSongs() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: songs, isLoading, isError } = useAvailableSongs();
  const { data: playlist } = usePlaylist(id);
  const addSong = usePlaylistSongMutation(id, true);
  const selected = new Set(playlist?.songs.map((song) => song._id) ?? []);

  const [hasAddedAnySong, setHasAddedAnySong] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = (songs ?? []).filter((song) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const titleMatch = song.musicTitle?.toLowerCase().includes(query);
    const artistMatch = song.primaryArtistName?.toLowerCase().includes(query);
    return titleMatch || artistMatch;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>

      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity className="p-1 -ml-1" onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-bold tracking-tight text-white">Add songs</Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          disabled={!hasAddedAnySong}
          className={`px-4 py-2 rounded-full ${hasAddedAnySong ? 'bg-[#1ed760] active:opacity-80' : 'bg-[#282828]'}`}
          onPress={() => router.push({
            pathname: "/(root)/(screens)/Playlist-Detail",
            params: { id: id }
          })}
        >
          <Text className={`font-bold text-sm ${hasAddedAnySong ? 'text-black' : 'text-neutral-500'}`}>
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* Beautiful Search Input Field */}
      {!isLoading && !isError && (
        <View className="px-5 pb-3">
          <View className="flex-row items-center bg-[#242424] rounded-lg px-3 py-2.5">
            <Search color="#b3b3b3" size={18} />
            <TextInput
              className="flex-1 ml-2 text-white font-medium text-sm p-0"
              placeholder="Search by title or artist..."
              placeholderTextColor="#7a7a7a"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="never" 
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} className="p-0.5">
                <X color="#b3b3b3" size={16} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator className="mt-8" color="#1ed760" size="large" />
      ) : isError ? (
        <Text className="mt-4 px-6 text-sm text-neutral-400">
          Could not load songs. Try again later.
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredSongs.length === 0 ? (
            <View className="items-center justify-center mt-12 px-4">
              <Text className="text-neutral-400 text-base font-semibold">No results found</Text>
              <Text className="text-neutral-500 text-xs text-center mt-1.5 leading-relaxed">
                We couldn't find any matches for "{searchQuery}". Check the spelling or try another term.
              </Text>
            </View>
          ) : (
            filteredSongs.map((song) => {
              const isAdded = selected.has(song._id);
              return (
                <View key={song._id} className="mb-4 flex-row items-center justify-between py-0.5">
                  <View className="flex-1 flex-row items-center mr-4">
                    {song.coverPhoto?.url ? (
                      <Image
                        source={{ uri: song.coverPhoto.url }}
                        className="h-12 w-12 rounded bg-[#242424]"
                      />
                    ) : (
                    <View className="h-12 w-12 rounded bg-[#242424] items-center justify-center">
                        <Text className="text-neutral-600 text-xs">♫</Text>
                      </View>
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
                    disabled={isAdded || addSong.isPending}
                    onPress={() =>
                      addSong.mutate(
                        { songId: song._id },
                        {
                          onSuccess: () => setHasAddedAnySong(true),
                          onError: (e) =>
                            Alert.alert("Could not add song", e.message),
                        },
                      )
                    }
                    className="h-10 w-10 items-center justify-center p-1 -mr-2"
                  >
                    {isAdded ? (
                      <Check color="#1ed760" size={22} strokeWidth={3} />
                    ) : (
                      <Plus color="white" size={22} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
