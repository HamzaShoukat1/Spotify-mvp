import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronDown,
  ListMusic,
  Maximize2,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { useGetMusicTrack } from "@/hooks/use-music";
import { formatTime, setupPlayer } from "@/services/player";
import { useAddTrackDataToAnalytics } from "@/hooks/use-analytics";
import { LikeButton } from "@/components/LikeButton";

export default function TrackView() {
  const { musicId } = useLocalSearchParams<{
    musicId: string;
  }>();

  const { data: musicData, isLoading, isError } = useGetMusicTrack(musicId);

  if (isError) {
    console.log("sassa");
  }

  const { mutateAsync: adduserdetailstodbforstreamtracking } =
    useAddTrackDataToAnalytics();

  const trackedMusicIdRef = useRef<string | null>(null);

  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const { duration, position } = useProgress(300);

  const isPlaying = playbackState.state === State.Playing;
  const musicCover = musicData?.coverPhoto?.url || activeTrack?.artwork;
  const musicTitle =
    musicData?.musicTitle || activeTrack?.title || "Unknown title";
  const artistName =
    musicData?.primaryArtistName || activeTrack?.artist || "Unknown artist";
  const musicUrl = musicData?.music?.url || activeTrack?.url;
  const artist = musicData?.artist;
  const artistImage = artist?.profileImage?.url;

  useEffect(() => {
    let cancelled = false;

    async function startTrack() {
      if (!musicUrl || !musicId) return;

      if (activeTrack?.id === musicId) return;

      try {
        await setupPlayer();

        if (cancelled) return;

        await TrackPlayer.reset();

        await TrackPlayer.add({
          id: musicId,
          url: musicUrl,
          title: musicTitle,
          artist: artistName,
          artwork: musicCover,
        });

        if (cancelled) return;

        await TrackPlayer.play();
      } catch (error) {
        console.error("Error initializing track playback:", error);
      }
    }

    startTrack();

    return () => {
      cancelled = true;
    };
  }, [musicId, musicUrl, musicTitle, artistName, musicCover]);

  useEffect(() => {
    if (
      playbackState.state === State.Ended ||
      playbackState.state === State.Stopped
    ) {
      trackedMusicIdRef.current = null;
      return;
    }

    if (
      !musicId ||
      activeTrack?.id !== musicId ||
      playbackState.state !== State.Playing ||
      position < 20 ||
      trackedMusicIdRef.current === musicId
    ) {
      return;
    }

    trackedMusicIdRef.current = musicId;

    adduserdetailstodbforstreamtracking({ musicId }).catch((error) => {
      trackedMusicIdRef.current = null;
      console.error("Analytics tracking failed:", error);
    });
  }, [
    activeTrack?.id,
    adduserdetailstodbforstreamtracking,
    musicId,
    playbackState.state,
    position,
  ]);

  const togglePlayback = async () => {
    if (isPlaying) await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#121212] px-6">
        <Text className="text-center text-white">
          Song data could not be loaded.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-full bg-white px-5 py-3"
        >
          <Text className="font-semibold text-black">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-2">
          <View className="flex-row items-center justify-between py-2">
            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <ChevronDown color="white" size={26} />
            </TouchableOpacity>
            <Text className="text-[11px] font-bold uppercase tracking-[2px] text-[#a7a7a7]">
              Now playing
            </Text>
            <TouchableOpacity hitSlop={12}>
              <MoreHorizontal color="white" size={25} />
            </TouchableOpacity>
          </View>
          <View className="mt-7 items-center">
            {musicCover ? (
              <Image
                source={{ uri: String(musicCover) }}
                className="aspect-square w-full max-w-[390px] rounded-md"
              />
            ) : (
              <View className="aspect-square w-full max-w-[390px] rounded-md bg-[#282828]" />
            )}
          </View>
          <View className="mt-8 flex-row items-center justify-between">
            <View className="flex-1 pr-5">
              <Text
                numberOfLines={1}
                className="text-[24px] font-bold text-white"
              >
                {musicTitle}
              </Text>
              <Text
                numberOfLines={1}
                className="mt-1 text-[15px] text-[#b3b3b3]"
              >
                {artistName}
              </Text>
            </View>
            <LikeButton musicId={musicId} />
          </View>
          <View className="mt-5">
            <Slider
              minimumValue={0}
              maximumValue={Math.max(duration, 1)}
              value={Math.min(position, duration || 0)}
              minimumTrackTintColor="#ffffff"
              maximumTrackTintColor="#5e5e5e"
              thumbTintColor="#ffffff"
              onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
            />
            <View className="-mt-1 ml-3 mr-3 flex-row items-center justify-between">
              <Text className="text-[11px] text-[#a7a7a7]">
                {formatTime(position)}
              </Text>
              <Text className="text-[11px] text-[#a7a7a7]">
                -{formatTime(Math.max(duration - position, 0))}
              </Text>
            </View>
          </View>
          <View className="mt-5 flex-row items-center justify-between px-2">
            <Shuffle color="#b3b3b3" size={20} />
            <SkipBack color="white" fill="white" size={26} />
            <TouchableOpacity
              onPress={togglePlayback}
              className="h-[64px] w-[64px] items-center justify-center rounded-full bg-white"
            >
              {isPlaying ? (
                <Pause color="#121212" fill="#121212" size={29} />
              ) : (
                <Play color="#121212" fill="#121212" size={29} />
              )}
            </TouchableOpacity>
            <SkipForward color="white" fill="white" size={26} />
            <Repeat color="#1ed760" size={20} />
          </View>
          <View className="mt-6 flex-row items-center justify-end gap-6">
            <Share2 color="#b3b3b3" size={19} />
            <ListMusic color="#b3b3b3" size={20} />
          </View>
        </View>

        {artist && (
          <View className="mt-10 bg-[#1b1b1b] px-5 pb-7 pt-6">
            <Text className="mb-4 text-[12px] font-bold uppercase tracking-[1.5px] text-[#b3b3b3]">
              About the artist
            </Text>
            <View className="overflow-hidden rounded-md bg-[#282828]">
              {artistImage ? (
                <Image
                  source={{ uri: artistImage }}
                  className="h-[220px] w-full resizeMode=cover"
                />
              ) : (
                <View className="h-[220px] w-full bg-[#3d3d3d]" />
              )}
              <View className="p-5">
                <View className="flex-row items-center">
                  <Text className="text-[24px] font-bold text-white">
                    {artist.name || artistName}
                  </Text>
                </View>
                {!!artist.artistType && (
                  <Text className="mt-1 text-sm text-[#b3b3b3]">
                    {artist.artistType}
                  </Text>
                )}
                {!!artist.bio && (
                  <Text className="mt-4 text-[14px] leading-5 text-[#d4d4d4]">
                    {artist.bio}
                  </Text>
                )}
                {!!artist.genres && (
                  <View className="mt-4 flex-row flex-wrap gap-2">
                    {artist.genres.split(",").map((genre) => (
                      <View
                        key={genre.trim()}
                        className="rounded-full bg-[#3b3b3b] px-3 py-1.5"
                      >
                        <Text className="text-xs text-white">
                          {genre.trim()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        <View className="mx-5 mt-6 rounded-md bg-[#282828] p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-white">Lyrics</Text>
            <TouchableOpacity
              onPress={() => router.push("/(root)/(screens)/Track-detail")}
              className="flex-row items-center"
            >
              <Text className="mr-2 text-[10px] font-bold uppercase tracking-wider text-[#b3b3b3]">
                More
              </Text>
              <Maximize2 color="#b3b3b3" size={13} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}