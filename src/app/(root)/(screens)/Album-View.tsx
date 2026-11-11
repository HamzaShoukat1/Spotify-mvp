import { ActivityIndicator, Image, Pressable, ScrollView, Share, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft,  Share2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import  { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
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
  const activeTrackId = String(activeTrack?.id ?? "");
  const isPlaying = playbackState.state === State.Playing;
  // const firstTrack = tracks[0];
  // const isFirstTrackActive = activeTrackId === firstTrack?._id;

  const openTrack = (musicId: string) => {
    router.push({ pathname: "/Track-View", params: { musicId } });
  };

  // const handlePlayAlbum = async () => {
  //   if (!firstTrack) return;
  //   if (isFirstTrackActive) {
  //     if (isPlaying) await TrackPlayer.pause();
  //     else await TrackPlayer.play();
  //     return;
  //   }
  //   openTrack(firstTrack._id);
  // };

  const shareAlbum = () => {
    Share.share({
      title: album.albumTitle,
      message: `${album.albumTitle} by ${album.artistName}`,
    }).catch(() => null);
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
            <Pressable
              accessibilityLabel="Share album"
              onPress={shareAlbum}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/25 active:opacity-70"
            >
              <Share2 color="#fff" size={20} />
            </Pressable>
          </View>

          <View className="items-center px-6">
            <Image
              source={coverUrl ? { uri: coverUrl } : AlbumPic}
              className="h-[270px] w-[270px] rounded-md bg-[#242424] shadow-2xl"
              resizeMode="cover"
            />
            <View className="w-full pt-6">
              <Text className="text-[11px] font-black uppercase tracking-[2px] text-[#b8eac5]">
                Album
              </Text>
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

          <View className="mt-7 flex-row items-center justify-between px-5">
            <View>
              <Text className="text-sm font-bold text-white">Ready when you are</Text>
              {/* <Text className="mt-1 text-xs text-[#b0b0b0]">Play the full album</Text> */}
            </View>
            <View className="flex-row items-center">
            {/* <Pressable
              accessibilityLabel={isFirstTrackActive && isPlaying ? "Pause album" : "Play album"}
              onPress={handlePlayAlbum}
              disabled={tracks.length === 0}
              className="h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] shadow-lg active:opacity-80"
            >
              {isFirstTrackActive && isPlaying ? (
                <Pause color="#071b0d" fill="#071b0d" size={23} />
              ) : (
                <Play color="#071b0d" fill="#071b0d" size={25} />
              )}
            </Pressable> */}
            </View>
          </View>

          <View className="mt-8 px-5">
            {tracks.length === 0 ? (
              <Text className="py-10 text-center text-[15px] text-[#a7a7a7]">
                No tracks have been added to this album yet.
              </Text>
            ) : (
              <>
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="text-[12px] font-black uppercase tracking-[1.5px] text-[#a7a7a7]">
                    Tracklist
                  </Text>
                  <Text className="text-xs text-[#777]">{tracks.length} songs</Text>
                </View>
                {tracks.map((track, index) => {
                  const isActive = activeTrackId === track._id;
                  return (
                    <Pressable
                      key={track._id}
                      accessibilityLabel={`${isActive && isPlaying ? "Pause" : "Play"} ${track.musicTitle}`}
                      onPress={() => openTrack(track._id)}
                      className="flex-row items-center rounded-xl py-3 active:bg-white/5"
                    >
                      <View className="w-8 items-center justify-center">
                        {isActive && isPlaying ? (
                          <PlayingIndicator />
                        ) : (
                          <Text className={isActive ? "text-[14px] font-bold text-[#1ed760]" : "text-[14px] text-[#a7a7a7]"}>
                            {track.trackNumber || index + 1}
                          </Text>
                        )}
                      </View>
                      {track.coverPhoto?.url ? (
                        <Image source={{ uri: track.coverPhoto.url }} className="ml-2 h-12 w-12 rounded-md bg-[#242424]" />
                      ) : (
                        <View className="ml-2 h-12 w-12 rounded-md bg-[#242424]" />
                      )}
                      <View className="ml-3 flex-1">
                        <Text className={isActive ? "text-[16px] font-bold text-[#1ed760]" : "text-[16px] font-semibold text-white"} numberOfLines={1}>
                          {track.musicTitle}
                        </Text>
                        <Text className="mt-1 text-[12px] text-[#a7a7a7]" numberOfLines={1}>
                          {album.artistName}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
