import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, MoreHorizontal } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { useAlbum } from "@/hooks/use-album";
import { AlbumPic } from "../../../assets/images";
import { PlayingIndicator } from "@/components/PlayingIndicator";

export default function AlbumView() {
  const params = useLocalSearchParams<{ albumId?: string | string[] }>();
  const albumId = Array.isArray(params.albumId) ? params.albumId[0] : params.albumId;
  const { data: album, isLoading, isError } = useAlbum(albumId ?? "");
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator color="#1DB954" size="large" />
      </View>
    );
  }

  if (isError || !album) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#121212] px-6">
        <Text className="text-center text-white">Album could not be loaded.</Text>
        <Pressable onPress={() => router.back()} className="mt-5 rounded-full bg-white px-5 py-3">
          <Text className="font-semibold text-black">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const tracks = Array.isArray(album.tracks) ? album.tracks : [];
  const coverUrl = album.albumCoverArt?.url;
  const playingTrackId = playbackState.state === State.Playing
    ? String(activeTrack?.id ?? "")
    : null;

  const openTrack = (musicId: string) => {
    router.push({ pathname: "/Track-View", params: { musicId } });
  };

  return (
    <LinearGradient
      colors={["#1b7a3d", "#174b2d", "#121212", "#121212"]}
      locations={[0, 0.32, 0.7, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        >
          <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
            <Pressable
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/25"
            >
              <ChevronLeft color="#fff" size={25} />
            </Pressable>
            <Pressable accessibilityLabel="More album options" className="h-10 w-10 items-center justify-center">
              <MoreHorizontal color="#fff" size={25} />
            </Pressable>
          </View>

          <View className="items-center px-6">
            <Image
              source={coverUrl ? { uri: coverUrl } : AlbumPic}
              className="h-[270px] w-[270px] rounded-md bg-[#242424] shadow-2xl"
              resizeMode="cover"
            />
            <View className="w-full pt-6">
              <Text className="text-[28px] font-black leading-8 text-white" numberOfLines={2}>
                {album.albumTitle}
              </Text>
              <Text className="mt-2 text-[15px] font-bold text-white">
                {album.artistName}
              </Text>
              <Text className="mt-2 text-[13px] text-[#c8c8c8]">
                Album · {tracks.length} {tracks.length === 1 ? "song" : "songs"}
              </Text>
            </View>
          </View>

          <View className="mt-5 flex-row items-center justify-end px-5">
            {/* <Pressable
              accessibilityLabel="Play album"
              onPress={() => tracks[0] && openTrack(tracks[0]._id)}
              disabled={tracks.length === 0}
              className="h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] active:opacity-80"
            >
              <Play color="#071b0d" fill="#071b0d" size={25} />
            </Pressable> */}
          </View>

          <View className="mt-3 px-5">
            {tracks.length === 0 ? (
              <Text className="py-10 text-center text-[15px] text-[#a7a7a7]">
                No tracks have been added to this album yet.
              </Text>
            ) : (
              tracks.map((track, index) => (
                <Pressable
                  key={track._id}
                  accessibilityLabel={`Play ${track.musicTitle}`}
                  onPress={() => openTrack(track._id)}
                  className="flex-row items-center py-3 active:opacity-60"
                >
                  <View className="w-9 items-center justify-center">
                    {playingTrackId === track._id ? (
                      <PlayingIndicator />
                    ) : (
                      <Text className="text-[14px] text-[#a7a7a7]">
                        {track.trackNumber || index + 1}
                      </Text>
                    )}
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-[16px] font-semibold text-white" numberOfLines={1}>
                      {track.musicTitle}
                    </Text>
                    <Text className="mt-1 text-[12px] text-[#a7a7a7]">
                      {album.artistName}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
